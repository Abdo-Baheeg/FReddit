import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        axios.get(`/api/posts/${id}`),
        axios.get(`/api/comments/post/${id}`)
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load post');
      setLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.put(
        `/api/posts/${id}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(response.data);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      await axios.post(
        '/api/comments',
        { content: commentContent, postId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentContent('');
      fetchPostAndComments();
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <div className="post-card">
        <div className="post-header">
          <div>
            <h2 className="post-title">{post.title}</h2>
            <div className="post-meta">
              Posted by {post.author?.username || 'Unknown'} in r/{post.subreddit}
            </div>
          </div>
          <div>
            <button onClick={() => handleVote('upvote')}>↑</button>
            <span> {post.score} </span>
            <button onClick={() => handleVote('downvote')}>↓</button>
          </div>
        </div>
        <p className="post-content">{post.content}</p>
      </div>

      <div className="form-container">
        <h3>Add a Comment</h3>
        <form onSubmit={handleCommentSubmit}>
          <div className="form-group">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="What are your thoughts?"
              required
            />
          </div>
          <button type="submit" className="btn">Comment</button>
        </form>
      </div>

      <div>
        <h3>{comments.length} Comments</h3>
        {comments.map(comment => (
          <div key={comment._id} className="post-card" style={{marginLeft: '20px'}}>
            <div className="post-meta">
              {comment.author?.username || 'Unknown'} • Score: {comment.score}
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;
