import React, { useState, useEffect } from "react";
import "./PostCard.css";
import { useNavigate } from "react-router-dom";
import { membershipApi } from "../api";

// === Icon assets ===
import imgDownvote from "../images/downvote.png";
import imgUpvote from "../images/upvote.png";
import imgComment from "../images/comment.png";
import imgShare from "../images/share.png";
import imgSave from "../images/save.png";
import imgSaved from "../images/saved.png";

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

/* ===============================
   Main Component
================================ */

export function PostCard({ post, onVote }) {
  const navigate = useNavigate();

  /* ---------- COMMUNITY JOIN LOGIC ---------- */

  const communityId =
    post.communityId ||
    post.community?._id ||
    post.subredditId;

  const [isJoined, setIsJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    if (!communityId) return;

    membershipApi
      .checkMembership(communityId)
      .then((res) => setIsJoined(!!res?.isMember))
      .catch(() => {});
  }, [communityId]);

  const handleJoinToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

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

  /* ---------- VOTING LOGIC ---------- */

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

    // FIX: use _id fallback
    onVote?.(post._id || post.id, dir);
  };

  return (
  <div className="post-card-container post-card">
    {/* Header */}
    <div className="post-card-header">
      <div className="post-card-title-row">
        <div className="post-card-meta">
          <span className="post-subreddit">r/{post.community?.name || post.subreddit || post.communityId || post.community?._id || post.subredditId}</span>
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
    <div className="vote-container">
      <VoteButton
        icon={imgUpvote}
        active={userVote === "up"}
        onClick={() => onVote("up")}
      />

      <span className="vote-count">{post.score}</span>

      <VoteButton
        icon={imgDownvote}
        active={userVote === "down"}
        onClick={() => onVote("down")}
      />
    </div>

    <ActionButton icon={imgComment}>
      <span className="action-count">{post.comments} Comment</span>
    </ActionButton>

    <ActionButton icon={imgShare}>
      <span className="share-text">Share</span>
    </ActionButton>
  </div>
);
