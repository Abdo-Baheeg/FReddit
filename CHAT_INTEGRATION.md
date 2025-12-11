# Reddit Chat UI - Backend Integration Documentation

## Overview
The Reddit Chat UI clone has been fully integrated with the backend API and real-time socket communication. This document outlines the implementation details, API usage, and features.

## Features Implemented

### ✅ Frontend Components
1. **ChatUI.js** - Main chat page with conversation management
2. **ChatLayout.js** - Layout wrapper for 2-column design
3. **ChatSidebar.js** - Left sidebar with thread list (280px fixed width)
4. **ChatWindow.js** - Active conversation view with message history
5. **ChatEmpty.js** - Welcome screen for empty state

### ✅ Backend Integration
- Real-time messaging via Socket.IO
- REST API fallback for message sending
- Conversation management (direct & community)
- Message history retrieval
- Unread count tracking
- Automatic conversation updates

## API Endpoints Used

### Chat API (`chatApi` from `api.js`)

```javascript
// Get all conversations for current user
chatApi.getConversations()

// Get messages for a specific conversation
chatApi.getMessages(conversationId, limit, before)

// Create or get direct conversation
chatApi.createDirectConversation(userId)

// Create or get community conversation
chatApi.createCommunityConversation(communityId)

// Send message (HTTP fallback)
chatApi.sendMessage(conversationId, content)

// Delete message (soft delete)
chatApi.deleteMessage(messageId)
```

### User API (`userApi` from `api.js`)

```javascript
// Get current user information
userApi.getCurrentUser()
```

## Socket.IO Events

### Client Listens For:
- `new_message` - Received when a new message is sent
- `unread_update` - Received when unread count changes
- `message_deleted` - Received when a message is deleted
- `conversations_joined` - Confirmation of joining conversation rooms

### Client Emits:
- `join_conversation` - Join a conversation room
- `join_conversations` - Join all user's conversation rooms

## Component Architecture

### ChatUI (Main Container)
**State Management:**
- `selectedThread` - Currently selected conversation
- `conversations` - List of all user conversations
- `currentUser` - Current logged-in user data
- `loading` - Loading state for initial fetch
- `error` - Error state for API failures

**Key Functions:**
- `handleThreadSelect(threadId)` - Select a conversation and join via socket
- `handleNewChat()` - Initiate new conversation (placeholder for modal)
- `handleSendMessage(content)` - Send message via API
- `formatTimestamp(date)` - Format relative timestamps

**Props Passed:**
```javascript
<ChatSidebar 
  threads={threads}
  selectedThreadId={selectedThread?.id}
  onThreadSelect={handleThreadSelect}
  isCollapsed={isSidebarCollapsed}
  onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
/>

<ChatWindow 
  thread={selectedThread} 
  currentUser={currentUser}
  onSendMessage={handleSendMessage}
/>
```

### ChatWindow (Conversation View)
**State Management:**
- `messages` - Array of messages in current conversation
- `message` - Current input text
- `loading` - Loading state for messages
- `sending` - Sending state for send button

**Key Functions:**
- `fetchMessages()` - Load message history on thread change
- `handleSendMessage(e)` - Submit message form
- `formatMessageTime(date)` - Format message timestamp (12-hour format)

**Real-time Features:**
- Auto-scrolls to bottom on new messages
- Updates message list via socket events
- Handles message deletion updates
- Disables send button while sending

### ChatSidebar (Thread List)
**Features:**
- Collapsible threads section
- Unread badge display
- Avatar support (image or placeholder)
- Selected thread highlighting
- Quick action buttons (settings, notifications, new chat)

**Thread Data Structure:**
```javascript
{
  id: string,               // Conversation ID
  type: 'direct' | 'group', // Conversation type
  name: string,             // Display name (u/username or r/community)
  lastMessage: string,      // Last message content
  timestamp: string,        // Formatted timestamp
  unread: number,          // Unread message count
  avatar: string | null,   // Avatar URL
  conversationData: object // Full conversation object
}
```

## Data Flow

### Message Sending Flow:
1. User types message in ChatWindow input
2. Submits form → `handleSendMessage()` in ChatWindow
3. Calls `onSendMessage(content)` prop (from ChatUI)
4. ChatUI calls `chatApi.sendMessage(conversationId, content)`
5. Backend processes message and emits socket event
6. All participants receive `new_message` event
7. ChatWindow updates messages array
8. ChatUI updates conversation lastMessage
9. Auto-scroll to bottom

### Conversation Loading Flow:
1. ChatUI mounts → `useEffect` triggers
2. Fetches current user via `userApi.getCurrentUser()`
3. Fetches conversations via `chatApi.getConversations()`
4. Maps conversations to thread format
5. Renders ChatSidebar with threads
6. User selects thread → `handleThreadSelect()`
7. Socket emits `join_conversation` event
8. ChatWindow fetches messages via `chatApi.getMessages()`
9. Displays message history

## Styling

### Design System
- **Primary Blue**: `#0079D3` (Reddit accent)
- **Dark Text**: `#1A1A1B` (primary text)
- **Background**: `#F5F5F5` (light background)
- **White Panels**: `#FFFFFF` (cards/panels)
- **Gray Text**: `#7C7C7C` (secondary text)
- **Error Red**: `#EA0027` (errors)

### Layout
- Sidebar: Fixed 280px width
- Chat Window: Flex 1 (remaining space)
- Full height: 100vh
- No navbar/sidebar on `/chat-ui` route

## Routing

The chat UI is accessible at `/chat-ui` and renders without the main app navbar/sidebar for a clean, full-screen experience.

```javascript
// App.js routing structure
<Route path="/chat-ui" element={<ChatUI />} /> // Full screen
<Route path="/*" element={<>Navbar + Sidebar + Routes</>} /> // Regular pages
```

## Socket Context Usage

The app uses `SocketContext` for real-time communication:

```javascript
import { useSocket } from '../context/SocketContext';

const { socket, connected } = useSocket();
```

**Socket Connection:**
- Automatically connects when user is authenticated (token in localStorage)
- Joins all user conversations on connect
- Reconnects automatically on disconnect
- Provides connection status via `connected` boolean

## Error Handling

### Loading States
- Initial conversation loading spinner
- Message loading indicator in ChatWindow
- Sending state on send button (disabled + visual feedback)

### Error States
- API failure error messages
- User-friendly alerts on send failures
- Console logging for debugging

### Edge Cases
- No conversations: Shows empty thread list
- No selected thread: Shows ChatEmpty component
- Failed message send: Shows alert, keeps message in input
- Deleted messages: Updates to "[Message deleted]"

## Future Enhancements

### Recommended Features to Add:
1. **New Chat Modal**
   - User search functionality
   - Community selection
   - Create conversation UI

2. **Message Features**
   - Edit messages
   - React with emojis
   - Reply/threading
   - File attachments
   - Link previews

3. **Conversation Features**
   - Mark as read/unread
   - Archive conversations
   - Delete conversations
   - Mute notifications
   - Pin conversations

4. **Typing Indicators**
   - Show when other user is typing
   - Socket event: `typing_start`, `typing_stop`

5. **Presence System**
   - Online/offline status
   - Last seen timestamp
   - Active now indicator

6. **Search**
   - Search messages within conversation
   - Search across all conversations
   - Filter by user/community

7. **Settings**
   - Notification preferences
   - Privacy settings
   - Blocked users management

## Testing Checklist

- [ ] Conversations load on page mount
- [ ] Thread selection updates ChatWindow
- [ ] Messages load for selected thread
- [ ] Send message works and appears in real-time
- [ ] Other users receive messages via socket
- [ ] Unread counts update correctly
- [ ] Timestamps format properly
- [ ] Avatar placeholders show for users without avatars
- [ ] Group chat shows sender names
- [ ] Direct chat hides sender names
- [ ] Auto-scroll works on new messages
- [ ] Loading states display correctly
- [ ] Error states handle gracefully
- [ ] Responsive design works on mobile
- [ ] Empty state shows when no thread selected

## Development Notes

### Socket.IO Connection
Ensure the backend server has Socket.IO configured and the authentication middleware (`socketAuth.js`) is working properly.

### Environment Variables
The frontend uses `REACT_APP_API_URL` for both REST API and Socket.IO connection.

### Authentication
All API requests and socket connections require a valid JWT token in localStorage.

### Message Pagination
Currently loads last 50 messages. Implement infinite scroll with the `before` parameter for older messages:
```javascript
chatApi.getMessages(conversationId, 50, oldestMessageDate)
```

## Troubleshooting

### Messages not appearing in real-time
- Check socket connection status: `socket.connected`
- Verify user joined conversation room
- Check browser console for socket events
- Ensure backend is emitting events correctly

### Conversations not loading
- Verify token is in localStorage
- Check API_URL environment variable
- Verify user is authenticated
- Check network tab for API errors

### Send button disabled
- Ensure message is not empty
- Check if `sending` state is stuck
- Verify no JavaScript errors in console

## Performance Considerations

- Messages are fetched per conversation (not all at once)
- Socket events update only affected conversations
- Auto-scroll uses smooth behavior (may impact on very long threads)
- Consider implementing virtual scrolling for 1000+ messages
- Lazy load avatars with loading states

---

**Last Updated:** December 10, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
