import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { feedApi, postApi } from '../api';
import { TrendingUp, Home as HomeIcon, Compass, Flame, Clock, Star, ChevronDown } from 'lucide-react';
import './Home.css';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedType, setFeedType] = useState('trending'); // trending, home, suggested, hot, new, top
  const [sortBy, setSortBy] = useState('hot'); // hot, new, top, rising
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const isLoggedIn = !!localStorage.getItem('token');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        case 'hot':
        case 'new':
        case 'top':
        case 'rising':
        default:
          try {
            response = await feedApi.getTrending(loadMore ? page : 1, 20);
          } catch (err) {
            console.warn('Feed not available, using all posts');
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
  }, [feedType, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMorePosts = () => {
    setPage(page + 1);
    fetchPosts(true);
  };

  const feedOptions = [
    { value: 'trending', label: 'Trending', icon: TrendingUp, description: 'Popular posts right now' },
    { value: 'hot', label: 'Hot', icon: Flame, description: 'Rising discussions' },
    { value: 'new', label: 'New', icon: Clock, description: 'Latest posts' },
    { value: 'top', label: 'Top', icon: Star, description: 'Most upvoted' },
  ];

  if (isLoggedIn) {
    feedOptions.unshift(
      { value: 'home', label: 'Home', icon: HomeIcon, description: 'Your personalized feed' },
      { value: 'suggested', label: 'Discover', icon: Compass, description: 'Recommended for you' }
    );
  }

  const currentFeed = feedOptions.find(opt => opt.value === feedType) || feedOptions[0];
  const CurrentIcon = currentFeed.icon;

  const handleFeedChange = (value) => {
    setFeedType(value);
    setShowDropdown(false);
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list">
      {/* Feed Selector Dropdown */}
      <div className="feed-selector-container">
        <div className="feed-dropdown" ref={dropdownRef}>
          <button 
            className="feed-dropdown-trigger"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="feed-dropdown-current">
              <CurrentIcon size={20} />
              <div className="feed-dropdown-label">
                <span className="feed-label-main">{currentFeed.label}</span>
                <span className="feed-label-desc">{currentFeed.description}</span>
              </div>
            </div>
            <ChevronDown size={20} className={`dropdown-chevron ${showDropdown ? 'open' : ''}`} />
          </button>

          {showDropdown && (
            <div className="feed-dropdown-menu">
              {feedOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    className={`feed-dropdown-item ${feedType === option.value ? 'active' : ''}`}
                    onClick={() => handleFeedChange(option.value)}
                  >
                    <OptionIcon size={20} />
                    <div className="feed-option-text">
                      <span className="feed-option-label">{option.label}</span>
                      <span className="feed-option-desc">{option.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
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
          <PostCard key={post._id} post={post} />
        ))
      )}
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
