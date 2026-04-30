// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store room information. Instead of a Set of IDs, we'll store a Map of user data.
// rooms Map -> { roomId: Map -> { socket.id: userData } }
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // MODIFIED: 'join-room' now accepts userData (name, language)
  socket.on('join-room', (roomId, userData) => {
    console.log(`User ${socket.id} (${userData.userName}) joining room ${roomId}`);
    
    socket.rooms.forEach(room => {
      if (room !== socket.id) socket.leave(room);
    });
    
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    
    const room = rooms.get(roomId);
    
    // Get other users' data before adding the new user
    const otherUsers = Array.from(room.values());
    
    // Add new user's data to the room
    room.set(socket.id, { id: socket.id, ...userData });

    // MODIFIED: Send the list of other users (with their data) to the new user
    socket.emit('room-users', otherUsers);

    // MODIFIED: Notify existing users about the new user (with their data)
    socket.to(roomId).emit('user-connected', { id: socket.id, ...userData });
    
    console.log(`Room ${roomId} now has ${room.size} participants`);
  });

  socket.on('offer', (data) => {
    // MODIFIED: Forward to a specific target user instead of the whole room
    socket.to(data.targetId).emit('offer', {
      offer: data.offer,
      senderId: socket.id
    });
  });

  socket.on('answer', (data) => {
    // MODIFIED: Forward to a specific target user
    socket.to(data.targetId).emit('answer', {
      answer: data.answer,
      senderId: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    // MODIFIED: Forward to a specific target user
    socket.to(data.targetId).emit('ice-candidate', {
      candidate: data.candidate,
      senderId: socket.id
    });
  });

  // NEW: Listen for transcript messages and broadcast them to the room
  socket.on('transcript-message', (data) => {
    socket.to(data.room).emit('transcript-message', {
      ...data.transcript,
      senderId: socket.id
    });
  });

  // NEW: Listen for chat messages and broadcast them
  socket.on('chat-message', (data) => {
    socket.to(data.room).emit('chat-message', {
      ...data,
      senderId: socket.id // Add senderId for identification
    });
  });
  socket.on("send-text", (data) => {
  console.log("Received text:", data);

  // broadcast to room (or all)
 socket.to(data.roomId).emit("new-translation", {
    source_text: data.text,
    translated_text: data.text, // temporary (Flask will replace)
    audio_url: null
  });
});

  const handleDisconnect = () => {
    console.log('User disconnected:', socket.id);
    rooms.forEach((participants, roomId) => {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        socket.to(roomId).emit('user-disconnected', socket.id);
        if (participants.size === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        }
      }
    });
  };

  socket.on('disconnect', handleDisconnect);

  socket.on('leave-room', (roomId) => {
    console.log(`User ${socket.id} leaving room ${roomId}`);
    socket.leave(roomId);
    handleDisconnect();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});