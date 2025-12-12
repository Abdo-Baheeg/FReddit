import React, { useState, useEffect } from 'react';
import { userApi } from '../api';

/**
 * Example component demonstrating how to use the new user activity endpoints
 * This can be used as a reference for implementing user profile pages
 */
const UserActivityExample = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('posts'); // posts, comments, upvoted, downvoted, overview
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await userApi.getUserStats(userId);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [userId]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let result;
        switch (activeTab) {
          case 'posts':
            result = await userApi.getUserPosts(userId, page, 20, 'new');
            setData(prev => page === 1 ? result.posts : [...prev, ...result.posts]);
            setHasMore(result.pagination.hasMore);
            break;
          
          case 'comments':
            result = await userApi.getUserComments(userId, page, 20, 'new');
            setData(prev => page === 1 ? result.comments : [...prev, ...result.comments]);
            setHasMore(result.pagination.hasMore);
            break;
          
          case 'upvoted':
            result = await userApi.getUserUpvoted(userId, page, 20, 'all');
            setData(prev => page === 1 ? result.upvotedItems : [...prev, ...result.upvotedItems]);
            setHasMore(result.pagination.hasMore);
            break;
          
          case 'downvoted':
            result = await userApi.getUserDownvoted(userId, page, 20, 'all');
            setData(prev => page === 1 ? result.downvotedItems : [...prev, ...result.downvotedItems]);
            setHasMore(result.pagination.hasMore);
            break;
          
          case 'overview':
            result = await userApi.getUserOverview(userId, page, 20, 'new');
            setData(prev => page === 1 ? result.items : [...prev, ...result.items]);
            setHasMore(result.pagination.hasMore);
            break;
          
          default:
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, activeTab, page]);

  // Reset data when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setData([]);
  };

  // Load more data
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="user-activity-container">
      {/* User Stats Section */}
      {stats && (
        <div className="user-stats">
          <h2>{stats.user.username}</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Karma</span>
              <span className="stat-value">{stats.user.karma}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Posts</span>
              <span className="stat-value">{stats.stats.posts}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Comments</span>
              <span className="stat-value">{stats.stats.comments}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Upvotes Given</span>
              <span className="stat-value">{stats.stats.upvotesGiven}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="activity-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => handleTabChange('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => handleTabChange('posts')}
        >
          Posts
        </button>
        <button 
          className={activeTab === 'comments' ? 'active' : ''}
          onClick={() => handleTabChange('comments')}
        >
          Comments
        </button>
        <button 
          className={activeTab === 'upvoted' ? 'active' : ''}
          onClick={() => handleTabChange('upvoted')}
        >
          Upvoted
        </button>
        <button 
          className={activeTab === 'downvoted' ? 'active' : ''}
          onClick={() => handleTabChange('downvoted')}
        >
          Downvoted
        </button>
      </div>

      {/* Content */}
      <div className="activity-content">
        {loading && page === 1 ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Render Posts */}
            {(activeTab === 'posts' || (activeTab === 'overview' && data.some(item => item.type === 'post'))) && (
              <div className="posts-list">
                {data.filter(item => !item.type || item.type === 'post').map(post => (
                  <div key={post._id || post.item?._id} className="post-card">
                    <h3>{post.title || post.item?.title}</h3>
                    <p>{post.content || post.item?.content}</p>
                    <div className="post-meta">
                      <span>Score: {post.score || post.item?.score}</span>
                      <span>By: {post.author?.username || post.item?.author?.username}</span>
                      {post.votedAt && <span>Voted: {new Date(post.votedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render Comments */}
            {(activeTab === 'comments' || (activeTab === 'overview' && data.some(item => item.type === 'comment'))) && (
              <div className="comments-list">
                {data.filter(item => !item.type || item.type === 'comment').map(comment => (
                  <div key={comment._id || comment.item?._id} className="comment-card">
                    <p>{comment.content || comment.item?.content}</p>
                    <div className="comment-meta">
                      <span>Score: {comment.score || comment.item?.score}</span>
                      <span>Post: {comment.post?.title || comment.item?.post?.title}</span>
                      {comment.votedAt && <span>Voted: {new Date(comment.votedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render Upvoted/Downvoted Items */}
            {(activeTab === 'upvoted' || activeTab === 'downvoted') && (
              <div className="voted-items-list">
                {data.map((item, index) => (
                  <div key={index} className="voted-item">
                    <span className="vote-type">{item.type}</span>
                    {item.type === 'post' ? (
                      <div className="post-card">
                        <h3>{item.item.title}</h3>
                        <p>{item.item.content}</p>
                      </div>
                    ) : (
                      <div className="comment-card">
                        <p>{item.item.content}</p>
                        <span>On: {item.item.post?.title}</span>
                      </div>
                    )}
                    <span className="voted-at">
                      {new Date(item.votedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <button 
                className="load-more-btn"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}

            {/* No Data Message */}
            {!loading && data.length === 0 && (
              <div className="no-data">
                No {activeTab} found for this user.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserActivityExample;

/**
 * CSS Styles for the component (add to your CSS file)
 */
const styles = `
.user-activity-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.user-stats {
  background: var(--reddit-card-bg);
  border: 1px solid var(--reddit-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: var(--reddit-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--reddit-text-primary);
}

.activity-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--reddit-border);
}

.activity-tabs button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--reddit-text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.activity-tabs button:hover {
  color: var(--reddit-text-primary);
}

.activity-tabs button.active {
  color: var(--reddit-orange);
  border-bottom-color: var(--reddit-orange);
}

.activity-content {
  background: var(--reddit-card-bg);
  border: 1px solid var(--reddit-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.post-card, .comment-card, .voted-item {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--reddit-border);
  margin-bottom: var(--spacing-lg);
}

.post-card:last-child, .comment-card:last-child, .voted-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.post-meta, .comment-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
  font-size: 12px;
  color: var(--reddit-text-secondary);
}

.load-more-btn {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--reddit-blue);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  margin-top: var(--spacing-lg);
}

.load-more-btn:hover:not(:disabled) {
  background: var(--reddit-blue-hover);
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading, .no-data {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--reddit-text-secondary);
}
`;

export { styles };
