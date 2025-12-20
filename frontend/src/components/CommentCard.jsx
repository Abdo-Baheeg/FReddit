import React, { useState, useEffect } from "react";
import "./CommentCard.css";
import { useNavigate } from "react-router-dom";
import { voteApi, savedApi, commentApi } from "../api";
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Bookmark,
  BookmarkCheck,
  Trash2,
  MoreHorizontal
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

const ActionButton = ({ icon: Icon, children, onClick, className = "" }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <button onClick={handleClick} className={`comment-action-button ${className}`}>
      <Icon size={16} />
      {children}
    </button>
  );
};

/* ===============================
   Main Component
================================ */

const CommentCard = ({ comment, postId, onReply, onDelete, depth = 0 }) => {
  const navigate = useNavigate();
  const maxDepth = 8;
  const commentId = comment._id || comment.id;

  /* ---------- VOTING LOGIC ---------- */

  const [userVote, setUserVote] = useState(null);
  const [score, setScore] = useState(comment.score ?? 0);
  const [upvoteCount, setUpvoteCount] = useState(comment.upvoteCount ?? 0);
  const [downvoteCount, setDownvoteCount] = useState(comment.downvoteCount ?? 0);
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
      const voteValue = userVote === dir ? 0 : dir === "up" ? 1 : -1;
      await voteApi.vote(commentId, "comment", voteValue);
    } catch (err) {
      console.error("Vote failed:", err);
      // Rollback on error
      setUserVote(previousVote);
      setScore(previousScore);
      setUpvoteCount(previousUpvoteCount);
      setDownvoteCount(previousDownvoteCount);
    } finally {
      setVoteLoading(false);
    }
  };

  /* ---------- SAVE LOGIC ---------- */

  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

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
  const [replyLoading, setReplyLoading] = useState(false);

  const handleReplyClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    setShowReplyBox(!showReplyBox);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim() || replyLoading) return;

    setReplyLoading(true);
    try {
      await commentApi.createComment({
        content: replyContent,
        postId: postId,
        parentCommentId: commentId
      });
      
      setReplyContent("");
      setShowReplyBox(false);
      
      if (onReply) {
        onReply(commentId);
      }
    } catch (err) {
      console.error("Reply failed:", err);
      alert("Failed to post reply");
    } finally {
      setReplyLoading(false);
    }
  };

  /* ---------- DELETE LOGIC ---------- */

  const [showMenu, setShowMenu] = useState(false);
  const isAuthor = comment.author?._id === localStorage.getItem("userId");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await commentApi.deleteComment(commentId);
      if (onDelete) {
        onDelete(commentId);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete comment");
    }
  };

  return (
    <div className={`comment-card depth-${Math.min(depth, maxDepth)}`}>
      <div className="comment-vote-sidebar">
        <VoteButton
          icon={ArrowBigUp}
          active={userVote === "up"}
          onClick={() => handleVote("up")}
        />
        <div className="comment-score">{score}</div>
        <VoteButton
          icon={ArrowBigDown}
          active={userVote === "down"}
          onClick={() => handleVote("down")}
        />
      </div>

      <div className="comment-content-area">
        <div className="comment-header">
          <span className="comment-author">
            {comment.author?.username || "Unknown"}
          </span>
          <span className="comment-meta">
            • {new Date(comment.createdAt).toLocaleDateString()}
          </span>
          
          {isAuthor && (
            <div className="comment-menu">
              <button 
                className="comment-menu-button"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal size={16} />
              </button>
              {showMenu && (
                <div className="comment-menu-dropdown">
                  <button onClick={handleDelete}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="comment-text">
          {comment.content}
        </div>

        <div className="comment-actions">
          <ActionButton icon={MessageSquare} onClick={handleReplyClick}>
            Reply
          </ActionButton>

          <ActionButton 
            icon={isSaved ? BookmarkCheck : Bookmark} 
            onClick={handleSave}
            className={isSaved ? "saved" : ""}
          >
            {isSaved ? "Saved" : "Save"}
          </ActionButton>

          <div className="comment-vote-counts">
            <span className="comment-vote-count-item">
              <ArrowBigUp size={14} className="vote-count-icon up" />
              {upvoteCount}
            </span>
            <span className="comment-vote-count-separator">•</span>
            <span className="comment-vote-count-item">
              <ArrowBigDown size={14} className="vote-count-icon down" />
              {downvoteCount}
            </span>
          </div>
        </div>

        {showReplyBox && (
          <div className="comment-reply-box">
            <textarea
              className="reply-textarea"
              placeholder="What are your thoughts?"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
            />
            <div className="reply-actions">
              <button 
                className="reply-cancel"
                onClick={() => setShowReplyBox(false)}
              >
                Cancel
              </button>
              <button 
                className="reply-submit"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || replyLoading}
              >
                {replyLoading ? "Posting..." : "Reply"}
              </button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply._id || reply.id}
                comment={reply}
                postId={postId}
                onReply={onReply}
                onDelete={onDelete}
                depth={depth + 1}
              />
            ))}
          </div>
        )}

        {depth >= maxDepth && comment.replies && comment.replies.length > 0 && (
          <button className="continue-thread">
            Continue this thread →
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
