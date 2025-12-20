import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchApi } from '../api';
import {PostCard} from '../components/PostCard';
import './Search.css';
import { Search as SearchIcon, Users, Layout, FileText, Loader } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({
    posts: { items: [], total: 0 },
    communities: { items: [], total: 0 },
    users: { items: [], total: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevant');

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await searchApi.search(query, activeTab, 1, 20, sortBy);
      setResults(data.results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query && query.trim().length >= 2) {
      performSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeTab, sortBy]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const navigateToCommunity = (name) => {
    navigate(`/f/${name}`);
  };

  const navigateToUser = (username) => {
    navigate(`/u/${username}`);
  };

  if (!query || query.trim().length < 2) {
    return (
      <div className="search-page">
        <div className="search-empty">
          <SearchIcon size={64} />
          <h2>Search FReddit</h2>
          <p>Enter at least 2 characters to search for posts, communities, and users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search results for "{query}"</h1>
        
        <div className="search-tabs">
          <button
            className={activeTab === 'all' ? 'active' : ''}
            onClick={() => handleTabChange('all')}
          >
            <Layout size={18} />
            All
          </button>
          <button
            className={activeTab === 'posts' ? 'active' : ''}
            onClick={() => handleTabChange('posts')}
          >
            <FileText size={18} />
            Posts {activeTab === 'posts' && results.posts?.total > 0 && `(${results.posts.total})`}
          </button>
          <button
            className={activeTab === 'communities' ? 'active' : ''}
            onClick={() => handleTabChange('communities')}
          >
            <Layout size={18} />
            Communities {activeTab === 'communities' && results.communities?.total > 0 && `(${results.communities.total})`}
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => handleTabChange('users')}
          >
            <Users size={18} />
            Users {activeTab === 'users' && results.users?.total > 0 && `(${results.users.total})`}
          </button>
        </div>

        {(activeTab === 'posts' || activeTab === 'all') && (
          <div className="search-sort">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
              <option value="relevant">Relevant</option>
              <option value="new">New</option>
              <option value="top">Top</option>
              <option value="comments">Comments</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="search-loading">
          <Loader className="spinner" size={32} />
          <p>Searching...</p>
        </div>
      ) : error ? (
        <div className="search-error">
          <p>{error}</p>
        </div>
      ) : (
        <div className="search-results">
          {/* Posts Results */}
          {(activeTab === 'all' || activeTab === 'posts') && (
            <div className="search-section">
              {activeTab === 'all' && <h2>Posts</h2>}
              {results.posts?.items?.length > 0 ? (
                <div className="posts-list">
                  {results.posts.items.map(post => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="no-results">No posts found</p>
              )}
            </div>
          )}

          {/* Communities Results */}
          {(activeTab === 'all' || activeTab === 'communities') && (
            <div className="search-section">
              {activeTab === 'all' && <h2>Communities</h2>}
              {results.communities?.items?.length > 0 ? (
                <div className="communities-list">
                  {results.communities.items.map(community => (
                    <div 
                      key={community._id} 
                      className="community-card"
                      onClick={() => navigateToCommunity(community.name)}
                    >
                      <div className="community-icon">
                        {community.icon_url ? (
                          <img src={community.icon_url} alt={community.name} />
                        ) : (
                          <Layout size={24} />
                        )}
                      </div>
                      <div className="community-info">
                        <h3>f/{community.name}</h3>
                        <p className="community-description">{community.description}</p>
                        <div className="community-meta">
                          <span>{community.memberCount || 0} members</span>
                          {community.category && <span>• {community.category}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-results">No communities found</p>
              )}
            </div>
          )}

          {/* Users Results */}
          {(activeTab === 'all' || activeTab === 'users') && (
            <div className="search-section">
              {activeTab === 'all' && <h2>Users</h2>}
              {results.users?.items?.length > 0 ? (
                <div className="users-list">
                  {results.users.items.map(user => (
                    <div 
                      key={user._id} 
                      className="user-card"
                      onClick={() => navigateToUser(user.username)}
                    >
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} />
                        ) : (
                          <Users size={24} />
                        )}
                      </div>
                      <div className="user-info">
                        <h3>u/{user.username}</h3>
                        {user.email && <p className="user-email">{user.email}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-results">No users found</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
