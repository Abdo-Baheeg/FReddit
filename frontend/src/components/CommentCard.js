import React, { useState, useEffect } from "react";
import "./CommentCard.css";
import { useNavigate } from "react-router-dom";
import { voteApi, savedApi } from "../api";
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Trash2,
  Flag
} from "lucide-react";

/* ===============================
   Reusable Small Components
================================ */

const VoteButton = ({ icon: Icon, active, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      type="button"
      className={`comment-vote-button ${active ? "active" : ""}`}
      onClick={handleClick}
    >
      <Icon size={18} />
    </button>
  );
};

const ActionButton = ({ icon: Icon, children, onClick, className = "" }) => (
  <button onClick={onClick} className={`comment-action-button ${className}`}>
    <Icon size={16} />
    {children}
  </button>
);

/* ===============================
   Main Comment Card Component
================================ */

const CommentCard = ({ 
  comment, 
  onVote, 
  onReply, 
  onDelete,
  currentUserId,
  depth = 0 
}) => {
  const navigate = useNavigate();
  const commentId = comment._id || comment.id;
  const MAX_DEPTH = 8; // Maximum nesting level

  /* ---------- VOTING LOGIC ---------- */

  const [userVote, setUserVote] = useState(null);
  const [score, setScore] = useState(comment.score ?? 0);
  const [voteLoading, setVoteLoading] = useState(false);

  // Fetch user's existing vote
  useEffect(() => {
    const fetchUserVote = async () => {
      if (!localStorage.getItem("token") || !commentId) return;
      
      try {
        const voteData = await voteApi.getUserVote(commentId, "comment");
        if (voteData?.vote) {
          setUserVote(voteData.vote.voteType === 1 ? "up" : "down");
        }
      } catch (err) {
        // User hasn't voted yet
      }
    };
    
    fetchUserVote();
  }, [commentId]);

  const handleVote = async (dir) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (voteLoading) return;
    setVoteLoading(true);

    const previousVote = userVote;
    const previousScore = score;

    // Optimistic update
    if (userVote === dir) {
      // Remove vote
      setUserVote(null);
      setScore((prev) => (dir === "up" ? prev - 1 : prev + 1));
    } else if (userVote) {
      // Change vote
      setUserVote(dir);
      setScore((prev) => (dir === "up" ? prev + 2 : prev - 2));
    } else {
      // New vote
      setUserVote(dir);
      setScore((prev) => (dir === "up" ? prev + 1 : prev - 1));
    }

    try {
      const voteType = userVote === dir ? 0 : (dir === "up" ? 1 : -1);
      await voteApi.vote(commentId, "comment", voteType);
      
      // Callback for parent component if provided
      onVote?.(commentId, dir);
    } catch (err) {
      console.error("Vote failed:", err);
      // Revert on error
      setUserVote(previousVote);
      setScore(previousScore);
    } finally {
      setVoteLoading(false);
    }
  };

  /* ---------- SAVE LOGIC ---------- */

  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!localStorage.getItem("token") || !commentId) return;
      
      try {
        const saveData = await savedApi.checkSaved(commentId, "comment");
        setIsSaved(!!saveData?.isSaved);
      } catch (err) {
        // Not saved
      }
    };
    
    checkSaveStatus();
  }, [commentId]);

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
      await savedApi.toggleSave(commentId, "comment");
      setIsSaved((prev) => !prev);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  /* ---------- REPLY LOGIC ---------- */

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply?.(commentId, replyContent);
      setReplyContent("");
      setShowReplyBox(false);
    }
  };

  /* ---------- MENU LOGIC ---------- */

  const [showMenu, setShowMenu] = useState(false);

  const handleShare = async () => {
    const commentUrl = `${window.location.origin}/post/${comment.postId}?comment=${commentId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Comment by u/${comment.author?.username || "user"}`,
          url: commentUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(commentUrl);
        }
      }
    } else {
      copyToClipboard(commentUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  const isOwner = currentUserId && (comment.author?._id === currentUserId || comment.author?.id === currentUserId || comment.userId === currentUserId);

  return (
    <div className={`comment-card depth-${Math.min(depth, MAX_DEPTH)}`}>
      <div className="comment-vote-sidebar">
        <VoteButton
          icon={ArrowBigUp}
          active={userVote === "up"}
          onClick={() => handleVote("up")}
        />
        <span className="comment-score">{score}</span>
        <VoteButton
          icon={ArrowBigDown}
          active={userVote === "down"}
          onClick={() => handleVote("down")}
        />
      </div>

      <div className="comment-content-wrapper">
        <div className="comment-header">
          <div className="comment-author-info">
            <span className="comment-author">
              u/{comment.author?.username || comment.username || "deleted"}
            </span>
            <span className="comment-time">
              • {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            {isOwner && <span className="comment-owner-badge">OP</span>}
          </div>

          <div className="comment-menu-container">
            <button 
              className="comment-menu-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal size={16} />
            </button>
            
            {showMenu && (
              <div className="comment-dropdown-menu">
                <button 
                  className="comment-menu-item"
                  onClick={handleSave}
                  disabled={saveLoading}
                >
                  {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  {isSaved ? "Unsave" : "Save"}
                </button>
                
                <button 
                  className="comment-menu-item"
                  onClick={handleShare}
                >
                  <Share2 size={16} />
                  Share
                </button>

                {isOwner && (
                  <button 
                    className="comment-menu-item danger"
                    onClick={() => onDelete?.(commentId)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}

                {!isOwner && (
                  <button className="comment-menu-item">
                    <Flag size={16} />
                    Report
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="comment-body">
          <p>{comment.content || comment.text}</p>
        </div>

        <div className="comment-actions">
          <ActionButton 
            icon={MessageSquare}
            onClick={() => setShowReplyBox(!showReplyBox)}
          >
            Reply
          </ActionButton>

          <ActionButton 
            icon={Share2}
            onClick={handleShare}
          >
            Share
          </ActionButton>

          <ActionButton 
            icon={isSaved ? BookmarkCheck : Bookmark}
            onClick={handleSave}
            className={isSaved ? "saved" : ""}
          >
            {isSaved ? "Saved" : "Save"}
          </ActionButton>
        </div>

        {showReplyBox && (
          <div className="comment-reply-box">
            <textarea
              className="comment-reply-input"
              placeholder="What are your thoughts?"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
            />
            <div className="comment-reply-actions">
              <button 
                className="comment-reply-cancel"
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyContent("");
                }}
              >
                Cancel
              </button>
              <button 
                className="comment-reply-submit"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && depth < MAX_DEPTH && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply._id || reply.id}
                comment={reply}
                onVote={onVote}
                onReply={onReply}
                onDelete={onDelete}
                currentUserId={currentUserId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentCard;
