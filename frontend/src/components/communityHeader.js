import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./communityHeader.css";

// ✅ USE ONLY THE CENTRAL API FILE
import { communityApi, membershipApi } from "../api";

export function requireAuthOrRedirect(navigate) {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return false;
  }
  return true;
}

export default function CommunityHeader({
  communityId,
  initialCommunity = null,
}) {
  return (
    <header className="subreddit-header">
      <HeaderContent
        communityId={communityId}
        initialCommunity={initialCommunity}
      />
    </header>
  );
}

function HeaderContent({ communityId, initialCommunity }) {
  const fallbackBanner = "/fallback-banner.png";
  const fallbackAvatar = "https://www.gravatar.com/avatar/?d=mp&s=200";
  const navigate = useNavigate();

  const normalize = (raw) => {
    if (!raw) return null;

    let membersCount =
      raw.memberCount ??
      raw.membersCount ??
      raw.members_count ??
      raw.member_count ??
      raw.members ??
      0;

    if (Array.isArray(membersCount)) membersCount = membersCount.length;

    return {
      _id: raw._id || raw.id,
      name: raw.name || "community",
      description: raw.description || "",
      coverImageUrl: raw.bannerUrl || raw.coverImageUrl || fallbackBanner,
      avatarUrl: raw.avatarUrl || fallbackAvatar,
      membersCount: Number(membersCount),
      postsCount: raw.postsCount ?? 0,
      isMember: false, // resolved separately
    };
  };

  const initialNormalized = normalize(initialCommunity);

  const [community, setCommunity] = useState(
    initialNormalized || {
      _id: communityId,
      name: "loading",
      description: "",
      coverImageUrl: fallbackBanner,
      avatarUrl: fallbackAvatar,
      membersCount: 0,
      postsCount: 0,
      isMember: false,
    }
  );

  const [loading, setLoading] = useState(!initialCommunity);
  const [optimistic, setOptimistic] = useState(false);

  // ✅ Fetch community
  useEffect(() => {
    if (!communityId || initialCommunity) return;

    let cancelled = false;
    setLoading(true);

    communityApi
      .getCommunityById(communityId)
      .then((data) => {
        if (cancelled) return;
        setCommunity((c) => ({ ...c, ...normalize(data) }));
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [communityId, initialCommunity]);

  // ✅ Resolve membership
  useEffect(() => {
    if (!community._id) return;

    membershipApi
      .checkMembership(community._id)
      .then((res) => {
        setCommunity((c) => ({
          ...c,
          isMember: !!res?.isMember,
        }));
      })
      .catch(() => {});
  }, [community._id]);

  const handleCreatePost = () => {
    if (!requireAuthOrRedirect(navigate)) return;
    navigate("/create-post", { state: { community } });
  };

  // ✅ Join / Leave → refresh page after success
  const handleJoinToggle = async () => {
    if (optimistic) return;
    if (!requireAuthOrRedirect(navigate)) return;

    const willJoin = !community.isMember;
    setOptimistic(true);

    try {
      if (willJoin) {
        await membershipApi.join(community._id);
      } else {
        await membershipApi.leave(community._id);
      }

      // 🔄 HARD REFRESH so CommunityPage + Gate re-evaluate
      window.location.reload();

    } catch (err) {
      console.error("Join/Leave failed", err);
      setOptimistic(false);
    }
  };

  if (loading) return null;

  return (
    <>
      <div
        className="subreddit-banner"
        style={{ backgroundImage: `url(${community.coverImageUrl})` }}
      >
        <div className="banner-overlay" />
      </div>

      <div className="subreddit-info-wrapper">
        <div className="subreddit-info">
          <img
            src={community.avatarUrl}
            className="subreddit-avatar"
            alt="community avatar"
          />

          <div className="subreddit-text">
            <h1 className="subreddit-title">r/{community.name}</h1>
            <p className="subreddit-subtitle">{community.description}</p>

            <div className="subreddit-meta">
              {community.membersCount.toLocaleString()} members
              <span className="dot">•</span>
              {community.postsCount} posts
            </div>
          </div>

          <div className="subreddit-actions">
            <button className="create" onClick={handleCreatePost}>
              + Create Post
            </button>

            <button
              className={community.isMember ? "joined" : "join"}
              onClick={handleJoinToggle}
              disabled={optimistic}
            >
              {community.isMember ? "Joined" : "Join"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
