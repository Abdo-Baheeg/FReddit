import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import CommentCard from './CommentCard';
import { postApi, commentApi, userApi } from '../api';

/**
 * Example: Using PostCard Component
 * 
 * The PostCard component handles voting, saving, and joining communities automatically.
 * It requires a post object and optionally an onVote callback.
 */

const PostExample = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postApi.getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleVote = (postId, direction) => {
    console.log(`Voted ${direction} on post ${postId}`);
    // Optional: Update parent state or trigger additional actions
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <PostCard 
          key={post._id || post.id} 
          post={post}
          onVote={handleVote}
        />
      ))}
    </div>
  );
};

/**
 * Example: Using CommentCard Component
 * 
 * The CommentCard component handles voting, saving, replying, and nested comments.
 * It requires a comment object and the current user's ID.
 */

const CommentExample = () => {
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const user = await userApi.getCurrentUser();
        setCurrentUserId(user._id || user.id);

        // Get comments for a post (example postId)
        const postId = 'YOUR_POST_ID_HERE';
        const commentData = await commentApi.getCommentsForPost(postId);
        setComments(commentData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVote = (commentId, direction) => {
    console.log(`Voted ${direction} on comment ${commentId}`);
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      const postId = 'YOUR_POST_ID_HERE';
      const newComment = await commentApi.createComment(content, postId, parentCommentId);
      
      // Update comments list
      setComments((prev) => [...prev, newComment]);
      console.log('Reply posted successfully');
    } catch (error) {
      console.error('Failed to post reply:', error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentApi.deleteComment(commentId);
      
      // Remove comment from list
      setComments((prev) => prev.filter((c) => c._id !== commentId && c.id !== commentId));
      console.log('Comment deleted successfully');
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="comments-container">
      <h2>Comments</h2>
      {comments.map((comment) => (
        <CommentCard
          key={comment._id || comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onVote={handleVote}
          onReply={handleReply}
          onDelete={handleDelete}
          depth={0}
        />
      ))}
    </div>
  );
};

/**
 * Post Object Structure:
 * 
 * {
 *   _id: string,
 *   title: string,
 *   content: string,
 *   author: { username: string, _id: string },
 *   community: { name: string, _id: string },
 *   score: number,
 *   comments: number,
 *   createdAt: string (ISO date),
 *   promoted: boolean (optional)
 * }
 */

/**
 * Comment Object Structure:
 * 
 * {
 *   _id: string,
 *   content: string,
 *   author: { username: string, _id: string },
 *   postId: string,
 *   score: number,
 *   createdAt: string (ISO date),
 *   replies: Comment[] (optional, for nested comments)
 * }
 */

export { PostExample, CommentExample };
