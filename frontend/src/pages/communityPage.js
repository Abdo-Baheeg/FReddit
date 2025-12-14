import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CommunityHeader from "../components/communityHeader";
import CommunitySidebar from "../components/communitySidebar";
import { communityApi } from "../api";
import "./communityPage.css";

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.communityId ?? params.id ?? params.slug ?? null;

  const navigate = useNavigate();
  const fetchUrlBase = "/api";

  const [currentUser, setCurrentUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchJson = async (url, opts = {}) => {
    const res = await fetch(url, opts);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(text || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    if (res.status === 204) return null;
    return res.json().catch(() => null);
  };

  const fetchCurrentUser = useCallback(async () => {
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      const data = await fetchJson(`${fetchUrlBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(data || null);
    } catch (err) {
      console.warn("Failed to fetch current user:", err.message || err);
      if (err.status === 401) {
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    }
  }, [fetchUrlBase, token]);

  const fetchCommunity = useCallback(async (id) => {
    if (!id) return;
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const data = await fetchJson(`${fetchUrlBase}/communities/${id}`, { headers });
      setCommunity(data);
    } catch (err) {
      console.error("fetchCommunity:", err);
      setError(err.message || "Failed to load community");
      setCommunity(null);
    }
  }, [fetchUrlBase, token]);

  const fetchPosts = useCallback(async (id, page = 1, sort = 'new') => {
    if (!id) return;
    try {
      setPosts(null);
      const response = await communityApi.getCommunityPosts(id, page, 20, sort);
      setPosts(response.posts || []);
    } catch (err) {
      console.error("fetchPosts:", err);
      // If community not found or has no posts endpoint yet, fallback to empty
      if (err.response?.status === 404) {
        setPosts([]);
      } else {
        setPosts([]);
      }
    }
  }, []);

  const fetchMemberships = useCallback(async () => {
    if (!token) {
      setMemberships([]);
      return;
    }
    try {
      const data = await fetchJson(`${fetchUrlBase}/memberships/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMemberships(Array.isArray(data) ? data : data?.memberships ?? []);
    } catch {
      setMemberships([]);
    }
  }, [fetchUrlBase, token]);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      if (!communityId) {
        setLoading(false);
        setError("Community id missing from route.");
        setCommunity(null);
        setPosts([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        await fetchCurrentUser();
        if (cancelled) return;

        await fetchCommunity(communityId);
        if (cancelled) return;

        await fetchPosts(communityId);
        if (cancelled) return;

        await fetchMemberships();
      } catch (err) {
        console.error("loadAll error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [communityId, fetchCurrentUser, fetchCommunity, fetchPosts, fetchMemberships]);

  const handleOpenCreatePage = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    navigate("/create-post", { state: { community } });
  };

  if (loading) return <div className="community-page-root">Loading community…</div>;
  if (error) return <div className="community-page-root">Error: {error}</div>;
  if (!community) return <div className="community-page-root">Community not found.</div>;

  return (
    <div className="community-page-root vpBody">
      <CommunityHeader
        communityId={communityId}
        initialCommunity={community}
        fetchUrlBase={fetchUrlBase}
      />

      <div className="community-page-body vpLayoutContainer">
        <main className="community-post-column vpPageContentWrapper">

          {posts === null ? (
            <div className="muted">Loading posts…</div>
          ) : posts.length === 0 ? (
            <div className="empty-posts vpEmptyState">
              <h2><b>This community doesn't have any posts yet</b></h2>
              <p>Make one and get this feed started.</p>

              <button className="vpCreatePostBtn" onClick={handleOpenCreatePage}>
                Create Post
              </button>

              <div style={{ marginTop: 8 }}>
                <Link to="/create-post" state={{ community }}>
                  Or open create post page
                </Link>
              </div>
            </div>
          ) : (
            <div className="posts-list vpPostsList">
              {posts.map((p) => (
                <article key={p._id || p.id} className="vpPostCard">
                  <div className="vpPostHeader">
                    <span>r/{community.name}</span>
                  </div>

                  <h3>{p.title}</h3>

                  <p>{p.content}</p>

                  <Link to={`/c/${communityId}/posts/${p._id}`}>View</Link>
                </article>
              ))}
            </div>
          )}
        </main>

        <aside className="community-sidebar-column vpRightSidebar">
          <CommunitySidebar community={community} currentUser={currentUser} />
        </aside>
      </div>
    </div>
  );
}
