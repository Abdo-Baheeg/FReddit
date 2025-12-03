const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.json(
    { 
      health: 'healthy',
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      database_connected: mongoose.connection.readyState === 1
     }
  );
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const communitiesRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/communities', communitiesRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO setup
const socketAuthMiddleware = require('./middleware/socketAuth');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

io.use(socketAuthMiddleware);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username} (${socket.user._id})`);

  // Join user's personal room
  socket.join(`user:${socket.user._id}`);

  // Join user's conversations
  socket.on('join_conversations', async () => {
    try {
      const conversations = await Conversation.find({
        participants: socket.user._id
      });

      conversations.forEach(conv => {
        socket.join(`conversation:${conv._id}`);
      });

      socket.emit('conversations_joined', { count: conversations.length });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join conversations' });
    }
  });

  // Send message
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, content } = data;

      // Verify user is part of conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.participants.includes(socket.user._id)) {
        return socket.emit('error', { message: 'Not authorized' });
      }

      // Create message
      const message = new Message({
        conversation: conversationId,
        sender: socket.user._id,
        content,
        readBy: [{ userId: socket.user._id }]
      });

      await message.save();
      await message.populate('sender', 'username avatar_url');

      // Update conversation
      conversation.lastMessage = message._id;
      conversation.updatedAt = Date.now();
      
      // Increment unread count for other participants
      conversation.participants.forEach(participantId => {
        if (!participantId.equals(socket.user._id)) {
          const unreadEntry = conversation.unreadCount.find(u => u.userId.equals(participantId));
          if (unreadEntry) {
            unreadEntry.count += 1;
          } else {
            conversation.unreadCount.push({ userId: participantId, count: 1 });
          }
        }
      });

      await conversation.save();

      // Emit to conversation room
      io.to(`conversation:${conversationId}`).emit('new_message', {
        message,
        conversationId
      });

      // Emit unread count update to other participants
      conversation.participants.forEach(participantId => {
        if (!participantId.equals(socket.user._id)) {
          io.to(`user:${participantId}`).emit('unread_update', {
            conversationId,
            unreadCount: conversation.unreadCount.find(u => u.userId.equals(participantId))?.count || 0
          });
        }
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Mark messages as read
  socket.on('mark_read', async (data) => {
    try {
      const { conversationId } = data;

      // Update conversation unread count
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const unreadEntry = conversation.unreadCount.find(u => u.userId.equals(socket.user._id));
        if (unreadEntry) {
          unreadEntry.count = 0;
          await conversation.save();
        }

        // Mark messages as read
        await Message.updateMany(
          {
            conversation: conversationId,
            'readBy.userId': { $ne: socket.user._id }
          },
          {
            $push: { readBy: { userId: socket.user._id } }
          }
        );

        socket.emit('marked_read', { conversationId });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to mark as read' });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { conversationId, isTyping } = data;
    socket.to(`conversation:${conversationId}`).emit('user_typing', {
      userId: socket.user._id,
      username: socket.user.username,
      isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.username}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
