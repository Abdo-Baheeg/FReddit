import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">

      {/* ===== Post Header ===== */}
      <div className="post-header">
        <div className="post-header-left">
          <span className="subreddit">r/{post.subreddit}</span>
          <span className="dot">•</span>
          <span className="time">1 day ago</span>
        </div>

        <div className="post-header-right">
          <button className="join-btn">Join</button>
          <button className="more-btn">•••</button>
        </div>
      </div>

      {/* ===== Post Title ===== */}
      <h3 className="post-title">{post.title}</h3>

      {/* ===== Post Media ===== */}
      {post.mediaUrl && (
        <div className="post-media">
          <img src={post.mediaUrl} alt="post media" />
        </div>
      )}

      {/* ===== Post Actions ===== */}
      <div className="post-actions">
        <button className="action-btn">⬆ {post.score || 0}</button>
        <button className="action-btn">💬 {post.commentCount || 0}</button>
        <button className="action-btn">↗ Share</button>
      </div>
    </div>
  );
};

export default PostCard;
