import React, { useState, useEffect } from "react";
import "./PostCard.css";
import { useNavigate } from "react-router-dom";
import { membershipApi, voteApi, savedApi, postApi } from "../api";
import AI_Summary from "./AI-summary";
import { Sparkles } from "lucide-react";

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

const Icon = ({ src, className = "", alt = "" }) => {
  return (
    <img 
      src={src} 
      alt={alt || "icon"} 
      className={`icon ${className}`}
      style={{ width: '20px', height: '20px', display: 'block' }}
      onError={(e) => {
        console.error("Failed to load icon:", src);
        e.target.style.border = '2px solid red'; 
      }}
    />
  );
};

const ActionButton = ({ icon, children, onClick, className = "" }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <button onClick={handleClick} className={`action-button ${className}`}>
      {icon}
      {children}
    </button>
  );
};

const VoteButton = ({ icon, active, onClick, disabled = false }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) onClick();
  };

  return (
    <button
      type="button"
      className={`vote-button ${active ? "active" : ""}`}
      onClick={handleClick}
      disabled={disabled}
      style={{
        background: 'transparent',
        border: 'none',
        padding: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1
      }}
    >
      <Icon src={icon} alt={active ? "active vote" : "vote"} />
    </button>
  );
};

/* ===============================
   Main Component
================================ */

export function PostCard({ post, onVote }) {
  const navigate = useNavigate();
  const postId = post._id || post.id;

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

  const [userVote, setUserVote] = useState(null);
  const [score, setScore] = useState(post.score ?? 0);

  const handleVote = (dir) => {
    console.log("Voting:", dir);
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


  /* ---------- SAVE LOGIC ---------- */

  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!localStorage.getItem("token") || !postId) return;
      
      try {
        const saveData = await savedApi.checkSaved(postId, "post");
        setIsSaved(!!saveData?.isSaved);
      } catch (err) {
        // Not saved
      }
    };
    
    checkSaveStatus();
  }, [postId]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (saveLoading) return;
    setSaveLoading(true);

    try {
      await savedApi.toggleSave(postId, "post");
      setIsSaved((prev) => !prev);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  /* ---------- AI SUMMARY LOGIC ---------- */

  const [showAISummary, setShowAISummary] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleAISummary = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (showAISummary) {
      setShowAISummary(false);
      return;
    }

    setShowAISummary(true);
    setAiError(null);

    // If we already have a summary, don't fetch again
    if (aiSummary) return;

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setAiLoading(true);

    try {
      // Call the actual API to generate summary
      const response = await postApi.generateSummary(postId);
      
      if (response.success && response.summary) {
        setAiSummary(response.summary);
      } else {
        throw new Error(response.message || "Failed to generate summary");
      }
    } catch (err) {
      console.error("AI summary failed:", err);
      setAiError(err.message || "Failed to generate AI summary");
      // Fallback to mock summary for demo
      const mockSummary = `This post discusses ${post.title.toLowerCase()}. ${post.content ? post.content.substring(0, 150) + '...' : 'Key insights and discussion points are highlighted by the community.'}`;
      setAiSummary(mockSummary);
    } finally {
      setAiLoading(false);
    }
  };

  /* ---------- NAVIGATION LOGIC ---------- */
  const handlePostClick = () => {
    const postId = post._id || post.id;
    navigate(`/post/${postId}`);
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
          
          <h2 
            className="post-card-title" 
            onClick={handlePostClick}
            style={{ cursor: 'pointer' }}
          >
            {post.title}
          </h2>
        </div>

        <div className="post-card-actions">
          <button
            className={`join-button ${isJoined ? "joined" : ""}`}
            onClick={handleJoinToggle}
            disabled={joinLoading}
          >
            {joinLoading ? "..." : isJoined ? "Joined" : "Join"}
          </button>

          <button 
            className={`save-button ${isSaved ? "saved" : ""}`}
            onClick={handleSave}
            disabled={saveLoading}
          >
            <Icon src={isSaved ? imgSaved : imgSave} alt="save" />
            {saveLoading ? "..." : isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {post.content && (
        <p 
          className="post-card-content" 
          onClick={handlePostClick}
          style={{ cursor: 'pointer' }}
        >
          {post.content}
        </p>
      )}

      {/* AI Summary Section */}
      {showAISummary && (
        <AI_Summary 
          summary={aiSummary} 
          isLoading={aiLoading}
          error={aiError}
        />
      )}

      {!post.promoted && (
        <PostActions
          post={{ ...post, score }}
          userVote={userVote}
          onVote={handleVote}
          onAISummary={handleAISummary}
          showAISummary={showAISummary}
        />
      )}
    </div>
  );
}
/* ===============================
   Post Actions
================================ */

const PostActions = ({ post, userVote, onVote, onAISummary, showAISummary, voteLoading }) => {
  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post._id || post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: postUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(postUrl);
        }
      }
    } else {
      copyToClipboard(postUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const postUrl = `${window.location.origin}/post/${post._id || post.id}`;
    window.open(postUrl, '_blank');
  };

  return (
    <div className="post-actions-container">
      <div className="vote-container">
        <VoteButton
          icon={imgUpvote}
          active={userVote === "up"}
          onClick={() => onVote("up")}
          disabled={voteLoading}
        />

        <span className="vote-count">{post.score}</span>

        <VoteButton
          icon={imgDownvote}
          active={userVote === "down"}
          onClick={() => onVote("down")}
          disabled={voteLoading}
        />
      </div>

      <ActionButton 
        icon={<Icon src={imgComment} />} 
        onClick={handleCommentClick}
      >
        <span className="action-count">{post.commentCount || 0} Comment{post.commentCount !== 1 ? 's' : ''}</span>
      </ActionButton>

      <ActionButton 
        icon={<Icon src={imgShare} />} 
        onClick={handleShare}
      >
        <span className="share-text">Share</span>
      </ActionButton>

      {/* AI Summary Button with Sparkles icon from lucide-react */}
      <ActionButton 
        icon={<Sparkles size={20} />} 
        onClick={onAISummary}
        className={showAISummary ? "active" : ""}
      >
        <span className="ai-text">AI Summary</span>
      </ActionButton>
    </div>
  );
};