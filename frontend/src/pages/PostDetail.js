import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { postApi, commentApi, voteApi } from '../api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userVote, setUserVote] = useState(null); // User's current vote on post
  const [commentVotes, setCommentVotes] = useState({}); // User's votes on comments

  const fetchPostAndComments = useCallback(async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        postApi.getPostById(id),
        commentApi.getCommentsForPost(id)
      ]);
      setPost(postData);
      setComments(commentsData);
      
      // Fetch user's vote if logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const voteData = await voteApi.getUserVote(id, 'Post');
          setUserVote(voteData.voteType);
          
          // Fetch votes for all comments
          const commentVotePromises = commentsData.map(comment =>
            voteApi.getUserVote(comment._id, 'Comment')
              .then(vote => ({ id: comment._id, voteType: vote.voteType }))
              .catch(() => ({ id: comment._id, voteType: null }))
          );
          const commentVoteResults = await Promise.all(commentVotePromises);
          const votesMap = {};
          commentVoteResults.forEach(v => votesMap[v.id] = v.voteType);
          setCommentVotes(votesMap);
        } catch (err) {
          // User hasn't voted yet
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load post');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleVote = async (voteType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      // Toggle vote if clicking same button
      const newVoteType = userVote === voteType ? 0 : voteType;
      await voteApi.vote(id, 'Post', newVoteType);
      
      // Update local state
      const voteChange = newVoteType - (userVote || 0);
      setPost(prev => ({
        ...prev,
        upvoteCount: prev.upvoteCount + (voteChange > 0 ? voteChange : voteChange === -2 ? -1 : 0),
        downvoteCount: prev.downvoteCount + (voteChange < 0 ? Math.abs(voteChange) : voteChange === 2 ? -1 : 0),
        score: prev.score + voteChange
      }));
      setUserVote(newVoteType || null);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleCommentVote = async (commentId, voteType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const currentVote = commentVotes[commentId] || null;
      const newVoteType = currentVote === voteType ? 0 : voteType;
      await voteApi.vote(commentId, 'Comment', newVoteType);
      
      // Update local state
      const voteChange = newVoteType - (currentVote || 0);
      setComments(prev => prev.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            upvoteCount: comment.upvoteCount + (voteChange > 0 ? voteChange : voteChange === -2 ? -1 : 0),
            downvoteCount: comment.downvoteCount + (voteChange < 0 ? Math.abs(voteChange) : voteChange === 2 ? -1 : 0),
            score: comment.score + voteChange
          };
        }
        return comment;
      }));
      setCommentVotes(prev => ({ ...prev, [commentId]: newVoteType || null }));
    } catch (err) {
      console.error('Comment vote failed:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      await commentApi.createComment(commentContent, id);
      setCommentContent('');
      fetchPostAndComments();
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-list">
      {/* Main Post */}
      <div className="post-card">
        <div className="post-vote-section">
          <button 
            onClick={() => handleVote(1)} 
            className={`vote-btn ${userVote === 1 ? 'upvoted' : ''}`}
          >
            ▲
          </button>
          <span className="vote-count">{post.score || 0}</span>
          <button 
            onClick={() => handleVote(-1)}
            className={`vote-btn ${userVote === -1 ? 'downvoted' : ''}`}
          >
            ▼
          </button>
        </div>
        <div className="post-content-section">
          <div className="post-header">
            <span className="subreddit-link">r/{post.subreddit}</span>
            <span className="post-meta">
              <span>•</span>
              <span>Posted by u/{post.author?.username || 'Unknown'}</span>
            </span>
          </div>
          <h2 className="post-title">{post.title}</h2>
          <p className="post-body" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
          <div className="post-actions">
            <button className="post-action-btn">
              <span>💬</span>
              <span>{comments.length} Comments</span>
            </button>
            <button className="post-action-btn">
              <span>🔗</span>
              <span>Share</span>
            </button>
            <button className="post-action-btn">
              <span>🔖</span>
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="post-card" style={{ marginTop: 'var(--spacing-md)' }}>
        <div className="post-content-section">
          <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: 'var(--spacing-sm)' }}>
            Comment as u/{post.author?.username || 'User'}
          </h3>
          <form onSubmit={handleCommentSubmit}>
            <div className="form-group" style={{ marginBottom: 'var(--spacing-sm)' }}>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="What are your thoughts?"
                required
                style={{ 
                  minHeight: '100px',
                  fontSize: '14px',
                  padding: 'var(--spacing-sm)'
                }}
              />
            </div>
            <button type="submit" className="btn">Comment</button>
          </form>
        </div>
      </div>

      {/* Comments Section */}
      <div style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: 500, 
          marginBottom: 'var(--spacing-md)',
          color: 'var(--reddit-text-secondary)'
        }}>
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        {comments.map(comment => (
          <div key={comment._id} className="post-card" style={{ marginBottom: 'var(--spacing-sm)' }}>
            <div className="post-vote-section">
              <button 
                onClick={() => handleCommentVote(comment._id, 1)}
                className={`vote-btn ${commentVotes[comment._id] === 1 ? 'upvoted' : ''}`}
              >
                ▲
              </button>
              <span className="vote-count">{comment.score || 0}</span>
              <button 
                onClick={() => handleCommentVote(comment._id, -1)}
                className={`vote-btn ${commentVotes[comment._id] === -1 ? 'downvoted' : ''}`}
              >
                ▼
              </button>
            </div>
            <div className="post-content-section">
              <div className="post-meta" style={{ marginBottom: 'var(--spacing-xs)' }}>
                <span style={{ fontWeight: 700, color: 'var(--reddit-text-primary)' }}>
                  u/{comment.author?.username || 'Unknown'}
                </span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{comment.content}</p>
              <div className="post-actions" style={{ marginTop: 'var(--spacing-xs)' }}>
                <button className="post-action-btn">
                  <span>💬</span>
                  <span>Reply</span>
                </button>
                <button className="post-action-btn">
                  <span>🔗</span>
                  <span>Share</span>
                </button>
                <button className="post-action-btn">
                  <span>⚠️</span>
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;
