const Notification = require('../models/Notifications');

/**
 * Create a notification for a user
 * @param {Object} params - Notification parameters
 * @param {string} params.userId - The user who will receive the notification
 * @param {string} params.type - Type of notification (comment, reply, upvote, etc.)
 * @param {string} params.contentId - ID of the related content
 * @param {string} params.triggeredBy - ID of the user who triggered the notification
 * @param {string} params.message - Notification message
 * @param {string} params.title - Optional notification title
 * @param {string} params.link - Optional link to navigate to
 */
const createNotification = async ({
  userId,
  type,
  contentId,
  triggeredBy,
  message,
  title = '',
  link = ''
}) => {
  try {
    // Don't create notification if user is triggering action on their own content
    if (userId.toString() === triggeredBy.toString()) {
      return null;
    }

    const notification = new Notification({
      user: userId,
      type,
      contentId,
      triggeredBy,
      message,
      title,
      link
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Create notification for a new comment
 */
const notifyComment = async (post, comment, commenter) => {
  return createNotification({
    userId: post.userId,
    type: 'comment',
    contentId: comment._id,
    triggeredBy: commenter._id,
    message: `${commenter.username} commented on your post`,
    title: post.title,
    link: `/post/${post._id}`
  });
};

/**
 * Create notification for a reply to a comment
 */
const notifyReply = async (parentComment, reply, replier) => {
  return createNotification({
    userId: parentComment.userId,
    type: 'reply',
    contentId: reply._id,
    triggeredBy: replier._id,
    message: `${replier.username} replied to your comment`,
    title: 'New Reply',
    link: `/post/${parentComment.postId}`
  });
};

/**
 * Create notification for an upvote
 */
const notifyUpvote = async (content, contentType, voter) => {
  const message = contentType === 'post' 
    ? `${voter.username} upvoted your post`
    : `${voter.username} upvoted your comment`;
  
  const link = contentType === 'post'
    ? `/post/${content._id}`
    : `/post/${content.postId}`;

  return createNotification({
    userId: content.userId,
    type: 'upvote',
    contentId: content._id,
    triggeredBy: voter._id,
    message,
    title: content.title || 'Upvote',
    link
  });
};

/**
 * Create notification for a mention (@username)
 */
const notifyMention = async (mentionedUserId, content, mentioner, contentType) => {
  const message = `${mentioner.username} mentioned you in a ${contentType}`;
  const link = contentType === 'post'
    ? `/post/${content._id}`
    : `/post/${content.postId}`;

  return createNotification({
    userId: mentionedUserId,
    type: 'mention',
    contentId: content._id,
    triggeredBy: mentioner._id,
    message,
    title: 'New Mention',
    link
  });
};

/**
 * Create notification for a new follower
 */
const notifyFollow = async (followedUserId, follower) => {
  return createNotification({
    userId: followedUserId,
    type: 'follow',
    contentId: follower._id,
    triggeredBy: follower._id,
    message: `${follower.username} started following you`,
    title: 'New Follower',
    link: `/user/${follower.username}`
  });
};

/**
 * Delete notifications for deleted content
 */
const deleteNotificationsForContent = async (contentId) => {
  try {
    await Notification.deleteMany({ contentId });
  } catch (error) {
    console.error('Error deleting notifications for content:', error);
  }
};

module.exports = {
  createNotification,
  notifyComment,
  notifyReply,
  notifyUpvote,
  notifyMention,
  notifyFollow,
  deleteNotificationsForContent
};
