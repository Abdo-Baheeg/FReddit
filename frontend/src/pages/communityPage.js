import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommunityHeader from "../components/communityHeader";
import CommunitySidebar from "../components/communitySidebar";
import {PostCard} from "../components/PostCard";
import PrivateCommunityGate from "../components/privateCommunityGate";
import "./communityPage.css";

import { userApi, communityApi, membershipApi } from "../api";

export default function CommunityPage() {
  const { communityId, id, slug } = useParams();
  const resolvedCommunityId = communityId ?? id ?? slug ?? null;

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [checkingMembership, setCheckingMembership] = useState(true);

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

        const postsArray = Array.isArray(communityPosts)
          ? communityPosts
          : communityPosts?.posts ?? [];

        setPosts(postsArray);

        if (user && !communityData.isPublic) {
          try {
            const membership = await membershipApi.checkMembership(
              resolvedCommunityId
            );
            setIsMember(!!membership?.isMember);
          } catch {
            setIsMember(false);
          }
        } else {
          setIsMember(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Failed to load community page.");
        }
      } finally {
        if (!cancelled) {
          setCheckingMembership(false);
          setLoading(false);
        }
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
    
    // Get current path as referrer
    const currentPath = window.location.pathname;
    
    // Make sure community object has all needed properties
    const communityData = {
      _id: community._id,
      name: community.name || community.title || 'Unknown',
      title: community.title,
      memberCount: community.memberCount || 0
    };
    
    navigate("/create-post", { 
      state: { 
        community: communityData,
        referrer: currentPath // Pass current page as referrer
      } 
    });
  };

  // ADD THIS FUNCTION - it was missing
  const openPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleJoinCommunity = async () => {
    try {
      await communityApi.joinCommunity(resolvedCommunityId);
      setIsMember(true); 
    } catch (err) {
      console.error("Failed to join community", err);
    }
  };

  if (loading)
    return <div className="community-page-root">Loading community…</div>;

  if (error)
    return <div className="community-page-root">Error: {error}</div>;

  if (!community)
    return <div className="community-page-root">Community not found.</div>;

  const shouldBlock =
    !community.isPublic && (!currentUser || !isMember);

  if (shouldBlock && !checkingMembership) {
    return (
      <PrivateCommunityGate
        community={community}
        isLoggedIn={!!currentUser}
        isMember={isMember}
        onJoin={handleJoinCommunity}
      />
    );
  }

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
              <h2>
                <b>This community doesn't have any posts yet</b>
              </h2>
              <p>Make one and get this feed started.</p>

              <button
                className="vpCreatePostBtn"
                onClick={handleCreatePost}
              >
                Create Post
              </button>
            </div>
          ) : (
            posts.map((post) => {
              const postId = post._id || post.id;

              return (
                <div
                  key={postId}
                  onClick={() => openPost(postId)}
                  style={{ cursor: "pointer" }}
                >
                  <PostCard post={post} />
                </div>
              );
            })
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