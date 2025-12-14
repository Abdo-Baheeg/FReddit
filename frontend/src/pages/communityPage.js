import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommunityHeader from "../components/communityHeader";
import CommunitySidebar from "../components/communitySidebar";
import PostCard from "../components/PostCard";
import { communityApi } from "../api";
import "./communityPage.css";

import {
  userApi,
  communityApi,
  membershipApi,
  communityPostsApi
} from "../api";

export default function CommunityPage() {
  const { communityId, id, slug } = useParams();
  const resolvedCommunityId = communityId ?? id ?? slug ?? null;

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
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
    if (!resolvedCommunityId) {
      setError("Community id missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [user, communityData, postsData] = await Promise.all([
          userApi.getCurrentUser().catch(() => null),
          communityApi.getCommunityById(resolvedCommunityId),
          communityPostsApi.getPostsByCommunity(resolvedCommunityId)
        ]);

        if (cancelled) return;

        setCurrentUser(user);
        setCommunity(communityData);
        setPosts(Array.isArray(postsData) ? postsData : postsData?.posts ?? []);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Failed to load community.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [resolvedCommunityId]);

  const handleCreatePost = () => {
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
        communityId={resolvedCommunityId}
        initialCommunity={community}
      />

      <div className="community-page-body vpLayoutContainer">
        <main className="community-post-column vpPageContentWrapper">

          {posts.length === 0 ? (
            <div className="empty-posts vpEmptyState">
              <h2><b>This community doesn't have any posts yet</b></h2>
              <p>Make one and get this feed started.</p>

              <button className="vpCreatePostBtn" onClick={handleCreatePost}>
                Create Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id || post.id} post={post} />
            ))
          )}
        </main>

        <aside className="community-sidebar-column vpRightSidebar">
          <CommunitySidebar community={community} currentUser={currentUser} />
        </aside>
      </div>
    </div>
  );
}
