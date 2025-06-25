const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

let users = {};
let messages = [];

io.on('connection', (socket) => {
  // User login
  socket.on('login', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('user_connected', username);
    socket.emit('chat_history', messages);
    io.emit('online_users', Object.values(users));
  });

  // Message event
  socket.on('message', (msg) => {
    const message = { user: users[socket.id], text: msg, time: new Date() };
    messages.push(message);
    io.emit('message', message);
  });

  // Typing indicator
  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('typing', { user: users[socket.id], isTyping });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('user_disconnected', username);
    io.emit('online_users', Object.values(users));
  });
});

app.get('/', (req, res) => {
  res.send('Chat server is running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 