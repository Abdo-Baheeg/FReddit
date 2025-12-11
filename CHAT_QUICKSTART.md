# Reddit Chat UI - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Backend server running on `http://localhost:5050` (or configured API_URL)
- MongoDB database connected
- User authentication working (JWT tokens)
- Socket.IO server configured

### Starting the Chat UI

1. **Ensure backend is running:**
   ```powershell
   cd backend
   npm start
   ```

2. **Start frontend development server:**
   ```powershell
   cd frontend
   npm start
   ```

3. **Access the chat UI:**
   - Navigate to: `http://localhost:3000/chat-ui`
   - You must be logged in (valid token in localStorage)

## 📋 Testing the Integration

### Test Scenario 1: View Conversations
1. Log in to your account
2. Navigate to `/chat-ui`
3. You should see:
   - List of your conversations in the left sidebar
   - "Welcome to chat!" empty state if no thread selected
   - Thread count badge
   - Settings, notifications, and new chat buttons

### Test Scenario 2: Open a Conversation
1. Click on any thread in the sidebar
2. You should see:
   - Thread becomes highlighted
   - Chat window loads with message history
   - User/community info in header
   - Message input box at bottom
   - Action buttons (call, video, info)

### Test Scenario 3: Send a Message
1. Select a conversation
2. Type a message in the input box
3. Press Enter or click send button
4. Message should appear immediately in the chat
5. Other participants should receive it via socket

### Test Scenario 4: Real-time Updates
1. Open the same conversation in two browser tabs/windows
2. Send a message from one tab
3. Message should appear in both tabs instantly
4. Unread count should update in sidebar

## 🔧 Configuration

### Environment Variables
Ensure your `.env` file in the frontend has:
```
REACT_APP_API_URL=http://localhost:5050
```

### Backend Socket.IO Setup
Verify your backend `server.js` has Socket.IO configured:
```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});
```

## 🐛 Common Issues

### Issue: "Loading conversations..." stuck
**Solution:**
- Check if backend is running
- Verify token exists in localStorage
- Check browser console for API errors
- Verify `REACT_APP_API_URL` is correct

### Issue: Messages not sending
**Solution:**
- Ensure conversation is selected
- Check if user is authenticated
- Verify socket connection (check console)
- Check backend chat routes are working

### Issue: Socket not connecting
**Solution:**
- Check token in localStorage: `localStorage.getItem('token')`
- Verify backend Socket.IO server is running
- Check CORS configuration on backend
- Look for socket errors in browser console

### Issue: No conversations showing
**Solution:**
- Create test conversations via Postman
- Verify user has conversations in database
- Check API endpoint: `GET /api/chat/conversations`
- Ensure user is part of at least one conversation

## 🧪 Creating Test Data

### Using Postman:

1. **Create Direct Conversation:**
   ```
   POST http://localhost:5050/api/chat/conversations/direct
   Headers: Authorization: Bearer <your_token>
   Body: { "userId": "<target_user_id>" }
   ```

2. **Send Test Message:**
   ```
   POST http://localhost:5050/api/chat/messages
   Headers: Authorization: Bearer <your_token>
   Body: { 
     "conversationId": "<conversation_id>",
     "content": "Hello, this is a test message!"
   }
   ```

3. **Get Conversations:**
   ```
   GET http://localhost:5050/api/chat/conversations
   Headers: Authorization: Bearer <your_token>
   ```

### Using MongoDB Directly:
```javascript
// Example conversation document
db.conversations.insertOne({
  type: 'direct',
  participants: [
    ObjectId('user1_id'),
    ObjectId('user2_id')
  ],
  unreadCount: [
    { userId: ObjectId('user1_id'), count: 0 },
    { userId: ObjectId('user2_id'), count: 0 }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## 📊 Monitoring

### Check Socket Connection:
Open browser console and run:
```javascript
// Check if socket exists and is connected
const socketContext = document.querySelector('[data-socket]');
console.log('Socket connected:', window.socket?.connected);
```

### Monitor Socket Events:
Add logging to SocketContext.js:
```javascript
socket.on('new_message', (data) => {
  console.log('New message received:', data);
  // ... rest of handler
});
```

### Check API Calls:
Open Network tab in DevTools and filter by:
- `conversations` - See conversation fetches
- `messages` - See message operations
- `ws` or `socket.io` - See WebSocket frames

## 🎯 Next Steps

### 1. Create New Chat Modal
Implement user/community selection for starting new chats:
```javascript
const handleNewChat = () => {
  // Show modal with user search
  // Call chatApi.createDirectConversation(userId)
  // Or chatApi.createCommunityConversation(communityId)
};
```

### 2. Add Typing Indicators
Emit typing events on input change:
```javascript
socket.emit('typing_start', { conversationId });
// Clear after 2 seconds of no typing
socket.emit('typing_stop', { conversationId });
```

### 3. Implement Message Pagination
Load more messages when scrolling up:
```javascript
const loadMoreMessages = async () => {
  const oldestMessage = messages[0];
  const olderMessages = await chatApi.getMessages(
    threadId, 
    50, 
    oldestMessage.createdAt
  );
  setMessages([...olderMessages, ...messages]);
};
```

### 4. Add Emoji Picker
Install emoji picker library:
```bash
npm install emoji-picker-react
```

### 5. File Upload Support
Implement attachment handling:
```javascript
const handleFileSelect = (e) => {
  const file = e.target.files[0];
  // Upload to server
  // Send message with attachment URL
};
```

## 📖 Documentation

For detailed implementation information, see:
- [CHAT_INTEGRATION.md](./CHAT_INTEGRATION.md) - Full integration documentation
- [backend/routes/chatRoutes.js](./backend/routes/chatRoutes.js) - API endpoints
- [frontend/src/context/SocketContext.js](./frontend/src/context/SocketContext.js) - Socket setup

## 💡 Tips

1. **Development Mode**: Keep browser console open to monitor socket events
2. **Multiple Users**: Test with incognito windows for different users
3. **Real-time Testing**: Have two browser windows side-by-side
4. **Database**: Use MongoDB Compass to inspect conversation/message documents
5. **Debugging**: Add console.logs in socket event handlers

## ✅ Feature Checklist

Core Features:
- [x] Load conversations from backend
- [x] Display thread list with avatars
- [x] Select conversation
- [x] Load message history
- [x] Send messages via API
- [x] Receive messages via Socket.IO
- [x] Update unread counts
- [x] Format timestamps
- [x] Auto-scroll on new messages
- [x] Loading states
- [x] Error handling
- [x] Full-screen layout (no navbar)

Optional Features (To Implement):
- [ ] New chat modal with user search
- [ ] Typing indicators
- [ ] Message pagination
- [ ] Emoji picker
- [ ] File attachments
- [ ] Message editing
- [ ] Message deletion UI
- [ ] Read receipts
- [ ] Online presence
- [ ] Message reactions
- [ ] Search functionality
- [ ] Archive conversations
- [ ] Notification preferences

---

**Need Help?**
- Check [CHAT_INTEGRATION.md](./CHAT_INTEGRATION.md) for detailed docs
- Review [Postman Collection](./FReddit_Chat_Postman_Collection.json) for API examples
- Inspect browser console for errors
- Check backend logs for Socket.IO events
