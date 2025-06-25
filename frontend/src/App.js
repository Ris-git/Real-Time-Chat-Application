import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [inputName, setInputName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat_history', (msgs) => setMessages(msgs));
    socket.on('message', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('user_connected', (user) => setMessages((prev) => [...prev, { user: 'System', text: `${user} joined the chat`, time: new Date() }]));
    socket.on('user_disconnected', (user) => setMessages((prev) => [...prev, { user: 'System', text: `${user} left the chat`, time: new Date() }]));
    socket.on('online_users', setOnlineUsers);
    socket.on('typing', ({ user, isTyping }) => setTypingUser(isTyping ? user : ''));
    return () => {
      socket.off('chat_history');
      socket.off('message');
      socket.off('user_connected');
      socket.off('user_disconnected');
      socket.off('online_users');
      socket.off('typing');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUsername(inputName);
      socket.emit('login', inputName);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', message);
      setMessage('');
      setIsTyping(false);
      socket.emit('typing', false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', true);
    }
    if (e.target.value === '') {
      setIsTyping(false);
      socket.emit('typing', false);
    }
  };

  if (!username) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Enter your username"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            required
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>Online Users</h3>
        <ul>
          {onlineUsers.map((user, idx) => (
            <li key={idx}>{user}</li>
          ))}
        </ul>
      </div>
      <div className="chat-main">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.user === username ? 'my-message' : msg.user === 'System' ? 'system-message' : 'other-message'}>
              <span className="msg-user">{msg.user}:</span> <span className="msg-text">{msg.text}</span>
              <span className="msg-time">{msg.time ? new Date(msg.time).toLocaleTimeString() : ''}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {typingUser && typingUser !== username && (
          <div className="typing-indicator">{typingUser} is typing...</div>
        )}
        <form onSubmit={handleSend} className="input-form">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            onBlur={() => { setIsTyping(false); socket.emit('typing', false); }}
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
