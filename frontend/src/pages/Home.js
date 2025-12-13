import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { feedApi, postApi } from '../api';
import './Home.css';



const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedType, setFeedType] = useState('trending'); // trending, home, suggested
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoggedIn = !!localStorage.getItem('token');

  const fetchPosts = useCallback(async (loadMore = false) => {
    try {
      setLoading(true);
      let response;
      
      switch(feedType) {
        case 'home':
          if (!isLoggedIn) {
            setFeedType('trending');
            return;
          }
          try {
            response = await feedApi.getHomeFeed(loadMore ? page : 1, 20);
          } catch (err) {
            console.warn('Home feed not available, using all posts');
            const posts = await postApi.getAllPosts();
            response = { posts, hasMore: false };
          }
          break;
        case 'suggested':
          if (!isLoggedIn) {
            setFeedType('trending');
            return;
          }
          try {
            response = await feedApi.getSuggestedFeed(loadMore ? page : 1, 20);
          } catch (err) {
            console.warn('Suggested feed not available, using all posts');
            const posts = await postApi.getAllPosts();
            response = { posts, hasMore: false };
          }
          break;
        case 'trending':
        default:
          try {
            response = await feedApi.getTrending(loadMore ? page : 1, 20);
          } catch (err) {
            console.warn('Trending feed not available, using all posts');
            const posts = await postApi.getAllPosts();
            response = { posts, hasMore: false };
          }
          break;
      }
      
      if (loadMore) {
        setPosts([...posts, ...response.posts]);
      } else {
        setPosts(response.posts);
        setPage(1);
      }
      setHasMore(response.hasMore || false);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
      setLoading(false);
    }
  }, [feedType]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMorePosts = () => {
    setPage(page + 1);
    fetchPosts(true);
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list">
      {/* Feed Type Tabs */}
      <div className="feed-tabs">
        <button 
          onClick={() => setFeedType('trending')} 
          className={`feed-tab ${feedType === 'trending' ? 'active' : ''}`}
        >
          <span>🔥</span>
          <span>Trending</span>
        </button>
        {isLoggedIn && (
          <>
            <button 
              onClick={() => setFeedType('home')} 
              className={`feed-tab ${feedType === 'home' ? 'active' : ''}`}
            >
              <span>🏠</span>
              <span>Home</span>
            </button>
            <button 
              onClick={() => setFeedType('suggested')} 
              className={`feed-tab ${feedType === 'suggested' ? 'active' : ''}`}
            >
              <span>✨</span>
              <span>Discover</span>
            </button>
          </>
        )}
      </div>

      {/* Posts */}
      {loading && page === 1 ? (
        <div className="loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="post-card">
          <div className="post-content-section">
            <p>No posts yet. Be the first to create one!</p>
          </div>
        </div>
      ) : (
        posts.map(post => (
          <Link to={`/post/${post._id}`} key={post._id}>
            <div className="post-card">
              <div className="post-vote-section">
                <button className="vote-btn" onClick={(e) => e.preventDefault()}>
                  ▲
                </button>
                <span className="vote-count">{post.score || 0}</span>
                <button className="vote-btn" onClick={(e) => e.preventDefault()}>
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
                <h3 className="post-title">{post.title}</h3>
                {post.content && (
                  <p className="post-body">
                    {post.content.substring(0, 300)}
                    {post.content.length > 300 && '...'}
                  </p>
                )}
                <div className="post-actions">
                  <button className="post-action-btn">
                    <span>💬</span>
                    <span>{post.commentCount || 0} Comments</span>
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
          </Link>
        ))
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <button 
          onClick={loadMorePosts} 
          className="btn" 
          style={{ marginTop: 'var(--spacing-lg)', width: '100%' }}
        >
          Load More Posts
        </button>
      )}
      
      {loading && page > 1 && (
        <div className="loading" style={{ marginTop: 'var(--spacing-lg)' }}>Loading more posts...</div>
      )}
    </div>
  );
};

export default Home;
