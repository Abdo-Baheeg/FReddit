import React, { useState, useEffect } from "react";
import "./PostCard.css";
import { useNavigate } from "react-router-dom";
import { membershipApi, voteApi, savedApi } from "../api";
import AI_Summary from "./AI-summary";
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  Bookmark,
  BookmarkCheck,
  Sparkles
} from "lucide-react";

/* ===============================
   Reusable Small Components
================================ */

const ActionButton = ({ icon: Icon, children, onClick, className = "" }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <button onClick={handleClick} className={`action-button ${className}`}>
      <Icon size={20} />
      {children}
    </button>
  );
};

const VoteButton = ({ icon: Icon, active, onClick, count }) => {
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
      <Icon size={20} />
    </button>
  );
};

/* ===============================
   Main Component
================================ */

const PostCard = ({ post, onVote }) => {
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
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount ?? 0);
  const [downvoteCount, setDownvoteCount] = useState(post.downvoteCount ?? 0);
  const [voteLoading, setVoteLoading] = useState(false);

  const postId = post._id || post.id;

  // Fetch user's existing vote
  useEffect(() => {
    const fetchUserVote = async () => {
      if (!localStorage.getItem("token") || !postId) return;
      
      try {
        const voteData = await voteApi.getUserVote(postId, "post");
        if (voteData?.vote) {
          setUserVote(voteData.vote.voteType === 1 ? "up" : "down");
        }
      } catch (err) {
        // User hasn't voted yet
      }
    };
    
    fetchUserVote();
  }, [postId]);

  const handleVote = async (dir) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (voteLoading) return;
    setVoteLoading(true);

    const previousVote = userVote;
    const previousScore = score;
    const previousUpvoteCount = upvoteCount;
    const previousDownvoteCount = downvoteCount;

    // Optimistic update
    if (userVote === dir) {
      // Remove vote
      setUserVote(null);
      setScore((prev) => (dir === "up" ? prev - 1 : prev + 1));
      if (dir === "up") {
        setUpvoteCount((prev) => prev - 1);
      } else {
        setDownvoteCount((prev) => prev - 1);
      }
    } else if (userVote) {
      // Change vote
      setUserVote(dir);
      setScore((prev) => (dir === "up" ? prev + 2 : prev - 2));
      if (dir === "up") {
        setUpvoteCount((prev) => prev + 1);
        setDownvoteCount((prev) => prev - 1);
      } else {
        setUpvoteCount((prev) => prev - 1);
        setDownvoteCount((prev) => prev + 1);
      }
    } else {
      // New vote
      setUserVote(dir);
      setScore((prev) => (dir === "up" ? prev + 1 : prev - 1));
      if (dir === "up") {
        setUpvoteCount((prev) => prev + 1);
      } else {
        setDownvoteCount((prev) => prev + 1);
      }
    }

    try {
      const voteType = userVote === dir ? 0 : (dir === "up" ? 1 : -1);
      await voteApi.vote(postId, "post", voteType);
      
      // Callback for parent component if provided
      onVote?.(postId, dir);
    } catch (err) {
      console.error("Vote failed:", err);
      // Revert on error
      setUserVote(previousVote);
      setScore(previousScore);      setUpvoteCount(previousUpvoteCount);
      setDownvoteCount(previousDownvoteCount);    } finally {
      setVoteLoading(false);
    }
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

  const handleAISummary = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (showAISummary) {
      setShowAISummary(false);
      return;
    }

    setShowAISummary(true);

    // If we already have a summary, don't fetch again
    if (aiSummary) return;

    setAiLoading(true);

    try {
      // Simulate AI summary generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock summary - replace with actual API call
      const mockSummary = `This post discusses ${post.title.toLowerCase()}. ${post.content ? post.content.substring(0, 150) + '...' : 'Key insights and discussion points are highlighted by the community.'}`;
      
      setAiSummary(mockSummary);
    } catch (err) {
      console.error("AI summary failed:", err);
      setAiSummary("Failed to generate summary. Please try again.");
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
          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          {isSaved ? "Saved" : "Save"}
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

    {showAISummary && (
      <AI_Summary summary={aiSummary} isLoading={aiLoading} />
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

const PostActions = ({ post, userVote, onVote, onAISummary, showAISummary, upvoteCount, downvoteCount }) => {
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

  return (
    <div className="post-actions-container">
      {/* Voting Buttons */}
      <div className="vote-container">
        <VoteButton
          icon={ArrowBigUp}
          active={userVote === "up"}
          onClick={() => onVote("up")}
        />
        <span className="vote-count">{post.score}</span>
        <VoteButton
          icon={ArrowBigDown}
          active={userVote === "down"}
          onClick={() => onVote("down")}
        />
      </div>

      <ActionButton icon={MessageSquare}>
        <span className="action-count">{post.comments || 0} Comment{post.comments !== 1 ? 's' : ''}</span>
      </ActionButton>

      <ActionButton icon={Share2} onClick={handleShare}>
        <span className="share-text">Share</span>
      </ActionButton>

      <ActionButton 
        icon={Sparkles} 
        onClick={onAISummary}
        className={showAISummary ? "active" : ""}
      >
        <span className="ai-text">AI Summary</span>
      </ActionButton>
    </div>
  );
};

export default PostCard;
