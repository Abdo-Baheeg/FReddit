const express = require('express');
const router = express.Router();
const Notification = require('../models/Notifications');
const auth = require('../middleware/auth');

// Get all notifications for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.userId })
      .populate('triggeredBy', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Get unread notification count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.userId,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

// Mark a notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ message: 'Error updating notifications' });
  }
});

// Delete a notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

// Delete all notifications
router.delete('/', auth, async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.userId });
    res.json({ message: 'All notifications deleted' });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    res.status(500).json({ message: 'Error deleting notifications' });
  }
});

// Create test notifications (for development/testing)
router.post('/test', auth, async (req, res) => {
  try {
    const testNotifications = [
      {
        user: req.user.userId,
        type: 'comment',
        contentId: '507f1f77bcf86cd799439011',
        message: 'Someone commented on your post "Testing notifications"',
        title: 'New Comment',
        link: '/post/507f1f77bcf86cd799439011'
      },
      {
        user: req.user.userId,
        type: 'upvote',
        contentId: '507f1f77bcf86cd799439012',
        message: 'Your post received an upvote',
        title: 'Upvoted',
        link: '/post/507f1f77bcf86cd799439012'
      },
      {
        user: req.user.userId,
        type: 'mention',
        contentId: '507f1f77bcf86cd799439013',
        message: 'You were mentioned in a post',
        title: 'New Mention',
        link: '/post/507f1f77bcf86cd799439013'
      },
      {
        user: req.user.userId,
        type: 'reply',
        contentId: '507f1f77bcf86cd799439014',
        message: 'Someone replied to your comment',
        title: 'New Reply',
        link: '/post/507f1f77bcf86cd799439014'
      }
    ];

    await Notification.insertMany(testNotifications);
    res.json({ message: 'Test notifications created', count: testNotifications.length });
  } catch (error) {
    console.error('Error creating test notifications:', error);
    res.status(500).json({ message: 'Error creating test notifications' });
  }
});

module.exports = router;
