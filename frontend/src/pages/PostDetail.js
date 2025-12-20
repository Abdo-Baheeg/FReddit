import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { postApi, commentApi, voteApi, membershipApi } from '../api';
import { useNavigate } from 'react-router-dom';
import "../components/PostCard.css";

// === Icon assets ===
import imgDownvote from "../images/downvote.png";
import imgUpvote from "../images/upvote.png";
import imgComment from "../images/comment.png";
import imgShare from "../images/share.png";
import imgSave from "../images/save.png";
import imgReply from "../images/comment.png";

/* ===============================
   Reusable Small Components
================================ */

const Icon = ({ src, className = "" }) => (
  <img src={src} alt="" className={`icon ${className}`} />
);

const ActionButton = ({ icon, children, onClick }) => (
  <button onClick={onClick} className="action-button">
    <Icon src={icon} />
    {children}
  </button>
);

const VoteButton = ({ icon, active, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      type="button"
      className={`vote-button ${active ? "active" : ""}`}
      onClick={handleClick}
    >
      <img src={icon} alt="" className="icon" />
    </button>
  );
};

const PostActions = ({ post, userVote, onVote, commentCount = 0 }) => (
  <div className="post-actions-container">
    <div className="vote-container">
      <VoteButton
        icon={imgUpvote}
        active={userVote === 1}
        onClick={() => onVote(1)}
      />

      <span className="vote-count">{post.score || 0}</span>

      <VoteButton
        icon={imgDownvote}
        active={userVote === -1}
        onClick={() => onVote(-1)}
      />
    </div>

    <ActionButton icon={imgComment}>
      <span className="action-count">{commentCount} Comments</span>
    </ActionButton>

    <ActionButton icon={imgShare}>
      <span className="share-text">Share</span>
    </ActionButton>
  </div>
);

const CommentForm = ({ onSubmit, placeholder = "What are your thoughts?", onCancel, autoFocus = false }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        required
        autoFocus={autoFocus}
        style={{ 
          width: '100%',
          minHeight: '100px',
          fontSize: '0.875rem',
          padding: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          resize: 'vertical',
          marginBottom: '0.5rem'
        }}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          type="submit" 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0A449B',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Comment
        </button>
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const Comment = ({ 
  comment, 
  level = 0, 
  onReply, 
  onVote, 
  userVote,
  isReplying,
  onStartReply,
  onCancelReply,
  commentVotes // Add this prop
}) => {
  const [showReplies, setShowReplies] = useState(true);
  const marginLeft = level * 2;

  return (
    <div 
      key={comment._id} 
      className="post-card-container post-card" 
      style={{ 
        marginBottom: '0.75rem',
        marginLeft: `${marginLeft}rem`,
        borderLeft: level > 0 ? '2px solid #e5e7eb' : 'none',
        paddingLeft: level > 0 ? '1rem' : '0'
      }}
    >
      <div className="post-card-header">
        <div className="post-card-meta">
          <span className="post-subreddit">u/{comment.author?.username || 'Unknown'}</span>
          <span className="post-time"> • {new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <p className="post-card-content">{comment.content}</p>
      
      <div className="post-actions-container" style={{ marginTop: '0.5rem' }}>
        <div className="vote-container">
          <VoteButton
            icon={imgUpvote}
            active={userVote === 1}
            onClick={() => onVote(comment._id, 1)}
          />
          <span className="vote-count">{comment.score || 0}</span>
          <VoteButton
            icon={imgDownvote}
            active={userVote === -1}
            onClick={() => onVote(comment._id, -1)}
          />
        </div>
        <button 
          onClick={() => onStartReply(comment._id)}
          className="action-button"
        >
          <Icon src={imgReply} />
          <span className="share-text">Reply</span>
        </button>
        <ActionButton icon={imgShare}>
          <span className="share-text">Share</span>
        </ActionButton>
      </div>

      {isReplying && (
        <div style={{ marginTop: '1rem' }}>
          <CommentForm
            onSubmit={(content) => onReply(comment._id, content)}
            placeholder="Write a reply..."
            onCancel={onCancelReply}
            autoFocus
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={() => setShowReplies(!showReplies)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0A449B',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            {showReplies ? '▼' : '▶'} {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>
          
          {showReplies && (
            <div style={{ marginTop: '0.75rem' }}>
              {comment.replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  level={level + 1}
                  onReply={onReply}
                  onVote={onVote}
                  userVote={commentVotes[reply._id]} // Use commentVotes prop
                  isReplying={isReplying} // Pass the appropriate replying state
                  onStartReply={onStartReply}
                  onCancelReply={onCancelReply}
                  commentVotes={commentVotes} // Pass down commentVotes
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userVote, setUserVote] = useState(null);
  const [commentVotes, setCommentVotes] = useState({});
  const [isJoined, setIsJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showNewCommentForm, setShowNewCommentForm] = useState(true);

  const fetchPostAndComments = useCallback(async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        postApi.getPostById(id),
        commentApi.getCommentsForPost(id)
      ]);
      setPost(postData);
      
      // Organize comments into a nested structure
      const commentMap = {};
      const rootComments = [];
      
      commentsData.forEach(comment => {
        commentMap[comment._id] = { ...comment, replies: [] };
      });
      
      commentsData.forEach(comment => {
        if (comment.parentComment) {
          if (commentMap[comment.parentComment]) {
            commentMap[comment.parentComment].replies.push(commentMap[comment._id]);
          }
        } else {
          rootComments.push(commentMap[comment._id]);
        }
      });
      
      setComments(rootComments);
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const voteData = await voteApi.getUserVote(id, 'Post');
          setUserVote(voteData.voteType);
          
          const commentVotePromises = commentsData.map(comment =>
            voteApi.getUserVote(comment._id, 'Comment')
              .then(vote => ({ id: comment._id, voteType: vote.voteType }))
              .catch(() => ({ id: comment._id, voteType: null }))
          );
          const commentVoteResults = await Promise.all(commentVotePromises);
          const votesMap = {};
          commentVoteResults.forEach(v => votesMap[v.id] = v.voteType);
          setCommentVotes(votesMap);

          if (postData.communityId || postData.subredditId) {
            membershipApi
              .checkMembership(postData.communityId || postData.subredditId)
              .then((res) => setIsJoined(!!res?.isMember))
              .catch(() => {});
          }
        } catch (err) {
          console.log("User hasn't voted yet");
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

  const handleJoinToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (!post) return;
    const communityId = post.communityId || post.subredditId;
    if (!communityId) return;

    if (joinLoading) return;
    setJoinLoading(true);

    try {
      if (isJoined) {
        await membershipApi.leave(communityId);
        setIsJoined(false);
      } else {
        await membershipApi.join(communityId);
        setIsJoined(true);
      }
    } catch (err) {
      console.error("Join/Leave failed", err);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const newVoteType = userVote === voteType ? 0 : voteType;
      await voteApi.vote(id, 'Post', newVoteType);
      
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
      navigate('/login');
      return;
    }

    try {
      const currentVote = commentVotes[commentId] || null;
      const newVoteType = currentVote === voteType ? 0 : voteType;
      await voteApi.vote(commentId, 'Comment', newVoteType);
      
      const voteChange = newVoteType - (currentVote || 0);
      
      // Update comment in nested structure
      const updateCommentVotes = (commentList) => {
        return commentList.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              upvoteCount: comment.upvoteCount + (voteChange > 0 ? voteChange : voteChange === -2 ? -1 : 0),
              downvoteCount: comment.downvoteCount + (voteChange < 0 ? Math.abs(voteChange) : voteChange === 2 ? -1 : 0),
              score: comment.score + voteChange
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentVotes(comment.replies)
            };
          }
          return comment;
        });
      };
      
      setComments(prev => updateCommentVotes(prev));
      setCommentVotes(prev => ({ ...prev, [commentId]: newVoteType || null }));
    } catch (err) {
      console.error('Comment vote failed:', err);
    }
  };

  const handleCommentSubmit = async (content) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await commentApi.createComment(content, id);
      setShowNewCommentForm(false);
      setTimeout(() => {
        setShowNewCommentForm(true);
        fetchPostAndComments();
      }, 100);
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const handleReplySubmit = async (parentCommentId, content) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await commentApi.createComment(content, id, parentCommentId);
      setReplyingTo(null);
      fetchPostAndComments();
    } catch (err) {
      console.error('Reply failed:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-detail-container">
      {/* Main Post */}
      <div className="post-card-container post-card">
        <div className="post-card-header">
          <div className="post-card-title-row">
            <div className="post-card-meta">
              <span className="post-subreddit">r/{post.community?.name || post.subreddit || post.communityId || post.subredditId}</span>
              <span className="post-time"> • {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            
            <h2 className="post-card-title">{post.title}</h2>
          </div>

          <div className="post-card-actions">
            <button
              className={`join-button ${isJoined ? "joined" : ""}`}
              onClick={handleJoinToggle}
              disabled={joinLoading}
            >
              {joinLoading ? "..." : isJoined ? "Joined" : "Join"}
            </button>

            <button className="save-button">
              <Icon src={imgSave} />
              Save
            </button>
          </div>
        </div>

        {post.content && (
          <p className="post-card-content">{post.content}</p>
        )}

        <PostActions
          post={post}
          userVote={userVote}
          onVote={handleVote}
          commentCount={comments.reduce((acc, comment) => {
            const countReplies = (c) => {
              let count = 1;
              if (c.replies && c.replies.length > 0) {
                c.replies.forEach(reply => count += countReplies(reply));
              }
              return count;
            };
            return acc + countReplies(comment);
          }, 0)}
        />
      </div>

      {/* Comment Form */}
      {showNewCommentForm && (
        <div className="post-card-container post-card" style={{ marginTop: '1rem' }}>
          <div className="post-card-header">
            <h3 className="post-card-title" style={{ fontSize: '1rem', fontWeight: 600 }}>
              Comment as u/{post.author?.username || 'User'}
            </h3>
          </div>
          <div className="post-card-content">
            <CommentForm
              onSubmit={handleCommentSubmit}
              placeholder="What are your thoughts?"
            />
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          marginBottom: '1rem',
          color: '#374151'
        }}>
          {comments.reduce((acc, comment) => {
            const countReplies = (c) => {
              let count = 1;
              if (c.replies && c.replies.length > 0) {
                c.replies.forEach(reply => count += countReplies(reply));
              }
              return count;
            };
            return acc + countReplies(comment);
          }, 0)} {comments.reduce((acc, comment) => {
            const countReplies = (c) => {
              let count = 1;
              if (c.replies && c.replies.length > 0) {
                c.replies.forEach(reply => count += countReplies(reply));
              }
              return count;
            };
            return acc + countReplies(comment);
          }, 0) === 1 ? 'Comment' : 'Comments'}
        </h3>
        {comments.map(comment => (
  <Comment
    key={comment._id}
    comment={comment}
    level={0}
    onReply={handleReplySubmit}
    onVote={handleCommentVote}
    userVote={commentVotes[comment._id]} // Pass commentVotes
    isReplying={replyingTo === comment._id}
    onStartReply={() => setReplyingTo(comment._id)}
    onCancelReply={() => setReplyingTo(null)}
    commentVotes={commentVotes} // Pass the entire commentVotes object
  />
))}
      </div>
    </div>
  );
};

export default PostDetail;