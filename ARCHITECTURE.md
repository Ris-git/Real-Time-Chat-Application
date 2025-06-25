# Architecture & Flow

## Overview
This real-time chat application is built with a Node.js/Express backend and a React frontend, using Socket.IO for real-time WebSocket communication.

## Backend
- **Express.js** serves as the HTTP server.
- **Socket.IO** manages WebSocket connections for real-time messaging.
- **In-memory storage** is used for users and chat history (for demo purposes).
- Handles events: user login, message, typing indicator, user connect/disconnect, and online users.

## Frontend
- **React** provides a responsive UI.
- **socket.io-client** connects to the backend for real-time updates.
- Features: login, chat window, online users, typing indicator, and chat history.

## Flow
1. **User Login**: User enters a username, which is sent to the backend via Socket.IO.
2. **Connection**: Backend stores the user and broadcasts their presence to others.
3. **Messaging**: Messages are sent/received in real time and stored in memory.
4. **Typing Indicator**: When a user types, a typing event is broadcast to others.
5. **Online Users**: The backend tracks and emits the list of online users.
6. **Chat History**: On login, the backend sends the chat history to the new user.

## Scalability
- The current implementation uses in-memory storage for simplicity. For production, use a database (e.g., MongoDB, Redis) and authentication.
- Socket.IO and Express can be scaled horizontally with sticky sessions or a message broker (e.g., Redis pub/sub).

## Diagram
```
[Client 1] <--Socket.IO--> [Server] <--Socket.IO--> [Client 2]
```

## Optional Improvements
- Persistent storage (database)
- User authentication
- Group/private chats
- Deployment to cloud 