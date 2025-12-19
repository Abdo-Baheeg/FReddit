import React, { useState } from 'react';
import './PostCard.css'; 

// === Icon assets ===
import imgDownvote from "../images/downvote.png";
import imgUpvote from "../images/upvote.png";
import imgComment from "../images/comment.png";
import imgShare from "../images/share.png";
import imgMore from "../images/menu.png";

/* ===============================
   Reusable Small Components
================================ */

const Icon = ({ src, className = "" }) => (
  <img 
    src={src} 
    alt="" 
    className={`icon ${className}`}
  />
);

const ActionButton = ({ icon, children, onClick }) => (
  <button
    onClick={onClick}
    className="action-button"
  >
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

/* ===============================
   Main Component
================================ */
export function PostCard({ post, onVote }) {
  const [userVote, setUserVote] = useState(null);
  const [score, setScore] = useState(post.score ?? 0);

  const handleVote = (dir) => {
    setScore((prev) => {
      if (userVote === dir) {
        // undo vote
        return dir === "up" ? prev - 1 : prev + 1;
      }
      if (userVote === "up" && dir === "down") return prev - 2;
      if (userVote === "down" && dir === "up") return prev + 2;

      return dir === "up" ? prev + 1 : prev - 1;
    });

    setUserVote((prev) => (prev === dir ? null : dir));
    onVote?.(post.id, dir);
  };

  return (
    <div className="post-card-container post-card">

      {/* Header row */}
<div className="post-card-header">
  <div className="post-card-title-row">
    <div className="post-card-meta">
      <span className="post-subreddit">r/{post.subreddit}</span>
      <span className="post-time">{post.time}</span>
    </div>

    {/* Post title */}
    <h2 className="post-card-title">{post.title}</h2>
  </div>

  <div className="post-card-actions">
    <button className="join-button">Join</button>

    <button className="more-button">
      <Icon src={imgMore} />
    </button>
  </div>
</div>


      {post.content && (
        <p className="post-card-content">
          {post.content}
        </p>
      )}

      {!post.promoted && (
        <PostActions
          post={{ ...post, score }}
          userVote={userVote}
          onVote={handleVote}
        />
      )}
    </div>
  );
}

/* ===============================
   Post Actions
================================ */

const PostActions = ({ post, userVote, onVote }) => (
  <div className="post-actions-container">
    
    {/* Votes */}
    <div className="vote-container">
      <VoteButton
        icon={imgUpvote}
        active={userVote === "up"}
        onClick={() => onVote("up")}
      />

      <span className="vote-count">
        {post.score}
      </span>

      <VoteButton
        icon={imgDownvote}
        active={userVote === "down"}
        onClick={() => onVote("down")}
      />
    </div>

    {/* Comments */}
    <ActionButton icon={imgComment}>
      <span className="action-count">
        {post.comments} Comment
      </span>
    </ActionButton>

    {/* Share */}
    <ActionButton icon={imgShare}>
      <span className="share-text">
        Share
      </span>
    </ActionButton>

  </div>
);
