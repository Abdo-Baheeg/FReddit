import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError(' Sorry Failed to load posts');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list">
      <h2>Recent Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to create one!</p>
      ) : (
        posts.map(post => (
          <Link to={`/post/${post._id}`} key={post._id}>
            <div className="post-card">
              <div className="post-header">
                <div>
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-meta">
                    Posted by {post.author?.username || 'Unknown'} in r/{post.subreddit}
                  </div>
                </div>
                <div>Score: {post.score}</div>
              </div>
              <p className="post-content">
                {post.content.substring(0, 200)}
                {post.content.length > 200 && '...'}
              </p>
              <div className="post-meta">
                {post.commentCount} comments
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default Home;
