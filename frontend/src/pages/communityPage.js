import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommunityHeader from "../components/communityHeader";
import CommunitySidebar from "../components/communitySidebar";
import PostCard from "../components/PostCard";
import "./communityPage.css";

// ✅ CENTRAL API ONLY
import { userApi, communityApi } from "../api";

export default function CommunityPage() {
  const { communityId, id, slug } = useParams();
  const resolvedCommunityId = communityId ?? id ?? slug ?? null;

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resolvedCommunityId) {
      setError("Community id missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPage() {
      setLoading(true);
      setError("");

      try {
        const [user, communityData, communityPosts] = await Promise.all([
          userApi.getCurrentUser().catch(() => null),
          communityApi.getCommunityById(resolvedCommunityId),
          communityApi.getCommunityPosts(resolvedCommunityId)
        ]);

        if (cancelled) return;

        setCurrentUser(user);
        setCommunity(communityData);

        // normalize posts response
        const postsArray = Array.isArray(communityPosts)
          ? communityPosts
          : communityPosts?.posts ?? [];

        setPosts(postsArray);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Failed to load community page.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPage();
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

  if (loading)
    return <div className="community-page-root">Loading community…</div>;

  if (error)
    return <div className="community-page-root">Error: {error}</div>;

  if (!community)
    return <div className="community-page-root">Community not found.</div>;

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
          <CommunitySidebar
            community={community}
            currentUser={currentUser}
          />
        </aside>
      </div>
    </div>
  );
}
