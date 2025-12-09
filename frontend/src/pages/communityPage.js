import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CommunityHeader from "../components/communityHeader.js"; 
import CommunitySidebar from "../components/communitySidebar.js"; 
import "./communityPage.css"; 

export default function CommunityPage() {
  const { communityId } = useParams(); 
  const navigate = useNavigate();
  const fetchUrlBase = "/api";

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState(null); // null = loading
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchCommunity = useCallback(
    async (id) => {
      if (!id) return;
      setLoadingCommunity(true);
      setError(null);
      try {
        const res = await fetch(`${fetchUrlBase}/communities/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Failed to load community (${res.status})`);
        }
        const data = await res.json();
        setCommunity(data);
      } catch (err) {
        console.error("fetchCommunity:", err);
        setError(err.message || "Failed to load community");
      } finally {
        setLoadingCommunity(false);
      }
    },
    [fetchUrlBase, token]
  );

  const fetchPosts = useCallback(
    async (id) => {
      if (!id) return;
      setLoadingPosts(true);
      setError(null);
      try {
        const res = await fetch(`${fetchUrlBase}/communities/${id}/posts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          // treat 404 as no posts
          if (res.status === 404) {
            setPosts([]);
            return;
          }
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Failed to load posts (${res.status})`);
        }
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data?.posts ?? [];
        setPosts(arr);
      } catch (err) {
        console.error("fetchPosts:", err);
        setError(err.message || "Failed to load posts");
        setPosts([]); // degrade gracefully
      } finally {
        setLoadingPosts(false);
      }
    },
    [fetchUrlBase, token]
  );

  useEffect(() => {
    if (!communityId) return;
    fetchCommunity(communityId);
    fetchPosts(communityId);
  }, [communityId, fetchCommunity, fetchPosts]);

 
  const handleOpenCreatePage = () => {
    navigate("/create-post", { state: { community } });
  };

  return (
    <div className="community-page-root">
      {}
      <CommunityHeader communityId={communityId} initialCommunity={community} fetchUrlBase={fetchUrlBase} />

      <div className="community-page-body">
        <main className="community-post-column" aria-live="polite">
          <div className="page-controls">
            <button className="create-post-primary" onClick={handleOpenCreatePage}>
              + Create Post
            </button>
          </div>

          {loadingPosts || posts === null ? (
            <div className="muted">Loading posts…</div>
          ) : posts.length === 0 ? (
            <div className="empty-posts">
              <h2>This community doesn't have any posts yet</h2>
              <p>Make one and get this feed started.</p>
              {/* link to your existing create-post page in the zip */}
              <button className="create-post-btn" onClick={handleOpenCreatePage}>
                Create Post
              </button>
              {/* fallback anchor */}
              <div style={{ marginTop: 8 }}>
                <Link to="/create-post" state={{ community }}>
                  Or open create post page
                </Link>
              </div>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((p) => (
                <article key={p._id || p.id} className="post-fallback-card">
                  <header className="post-header">
                    <h3 className="post-title">{p.title || "Untitled post"}</h3>
                    <div className="post-meta">
                      <span>by {p.author?.username || p.author || "unknown"}</span>
                      <span> • </span>
                      <span>{new Date(p.createdAt || p.created_at || Date.now()).toLocaleString()}</span>
                    </div>
                  </header>

                  <section className="post-body">
                    <p>{p.excerpt ?? (p.body && p.body.slice(0, 300)) ?? ""}</p>
                  </section>

                  <footer className="post-actions">
                    <Link to={`/c/${communityId}/posts/${p._id || p.id}`}>View</Link>
                    {/* When you add your Post component, replace the fallback rendering above
                        with: <Post post={p} /> (import Post at top). */}
                  </footer>
                </article>
              ))}
            </div>
          )}

          {error && <div className="error">Error: {error}</div>}
        </main>

        <aside className="community-sidebar-column">
          <CommunitySidebar community={community} currentUser={null} />
        </aside>
      </div>
    </div>
  );
}
