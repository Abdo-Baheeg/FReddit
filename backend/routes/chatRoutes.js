const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Community = require('../models/Community');
const User = require('../models/User');

// @route   GET /api/chat/conversations
// @desc    Get all conversations for the current user
// @access  Private
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'username avatar_url')
      .populate('community', 'name description')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username' }
      })
      .sort({ updatedAt: -1 });

    // Add unread count for current user
    const conversationsWithUnread = conversations.map(conv => {
      const unreadEntry = conv.unreadCount.find(u => u.userId.equals(req.user._id));
      return {
        ...conv.toObject(),
        unreadCount: unreadEntry ? unreadEntry.count : 0
      };
    });

    res.json(conversationsWithUnread);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/chat/conversations/:id/messages
// @desc    Get messages for a conversation
// @access  Private
router.get('/conversations/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, before } = req.query;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(id);
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const query = {
      conversation: id,
      deleted: false
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('sender', 'username avatar_url')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/chat/conversations/direct
// @desc    Create or get direct conversation between two users
// @access  Private
router.post('/conversations/direct', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      type: 'direct',
      participants: { $all: [req.user._id, userId], $size: 2 }
    })
      .populate('participants', 'username avatar_url')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username' }
      });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        type: 'direct',
        participants: [req.user._id, userId]
      });
      await conversation.save();
      await conversation.populate('participants', 'username avatar_url');
    }

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/chat/conversations/community
// @desc    Create or get community conversation
// @access  Private
router.post('/conversations/community', authMiddleware, async (req, res) => {
  try {
    const { communityId } = req.body;

    if (!communityId) {
      return res.status(400).json({ message: 'Community ID is required' });
    }

    // Check if community exists and user is a member
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (!community.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'You must be a member of this community' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      type: 'community',
      community: communityId
    })
      .populate('participants', 'username avatar_url')
      .populate('community', 'name description')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username' }
      });

    if (!conversation) {
      // Create new conversation with all community members
      conversation = new Conversation({
        type: 'community',
        participants: community.members,
        community: communityId
      });
      await conversation.save();
      await conversation.populate('participants', 'username avatar_url');
      await conversation.populate('community', 'name description');
    } else {
      // Update participants to match current community members
      conversation.participants = community.members;
      await conversation.save();
    }

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/chat/messages
// @desc    Send a message (HTTP fallback)
// @access  Private
router.post('/messages', authMiddleware, async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ message: 'Conversation ID and content are required' });
    }

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: req.user._id,
      content,
      readBy: [{ userId: req.user._id }]
    });

    await message.save();
    await message.populate('sender', 'username avatar_url');

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.updatedAt = Date.now();
    
    // Increment unread count for other participants
    conversation.participants.forEach(participantId => {
      if (!participantId.equals(req.user._id)) {
        const unreadEntry = conversation.unreadCount.find(u => u.userId.equals(participantId));
        if (unreadEntry) {
          unreadEntry.count += 1;
        } else {
          conversation.unreadCount.push({ userId: participantId, count: 1 });
        }
      }
    });

    await conversation.save();

    // Emit via socket if available
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${conversationId}`).emit('new_message', {
        message,
        conversationId
      });

      // Emit unread count update
      conversation.participants.forEach(participantId => {
        if (!participantId.equals(req.user._id)) {
          io.to(`user:${participantId}`).emit('unread_update', {
            conversationId,
            unreadCount: conversation.unreadCount.find(u => u.userId.equals(participantId))?.count || 0
          });
        }
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/chat/messages/:id
// @desc    Delete a message (soft delete)
// @access  Private
router.delete('/messages/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    message.deleted = true;
    message.content = '[Message deleted]';
    await message.save();

    // Emit via socket if available
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${message.conversation}`).emit('message_deleted', {
        messageId: message._id,
        conversationId: message.conversation
      });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
