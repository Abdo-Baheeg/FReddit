import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./communityHeader.css";

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
  fetchUrlBase = "/api",
  joinEndpoint,
  leaveEndpoint,
}) {
  return (
    <header className="subreddit-header">
      <HeaderContent
        communityId={communityId}
        initialCommunity={initialCommunity}
        fetchUrlBase={fetchUrlBase}
        joinEndpoint={joinEndpoint}
        leaveEndpoint={leaveEndpoint}
      />
    </header>
  );
}

function HeaderContent({
  communityId: propCommunityId,
  initialCommunity,
  fetchUrlBase,
  joinEndpoint,
  leaveEndpoint,
}) {
  const fallbackBanner = "/fallback-banner.png";
  const fallbackAvatar = "https://www.gravatar.com/avatar/?d=mp&s=200";

  const navigate = useNavigate();

  const normalize = (raw) => {
    if (!raw) return null;

    const pick = (...keys) => {
      for (const k of keys) {
        if (raw[k] !== undefined && raw[k] !== null) return raw[k];
      }
      return undefined;
    };

    let membersCount = pick(
      "memberCount",
      "membersCount",
      "members_count",
      "member_count",
      "members"
    );

    if (Array.isArray(membersCount)) membersCount = membersCount.length;
    membersCount = Number(membersCount || 0);

    return {
      _id: raw._id || raw.id || null,
      name: raw.name || "community",
      description: raw.description || "",
      coverImageUrl: raw.bannerUrl || raw.coverImageUrl || fallbackBanner,
      avatarUrl: raw.avatarUrl || fallbackAvatar,
      membersCount,
      postsCount: raw.postsCount ?? 0,
      isMember: raw.isMember ?? false,
      __raw: raw,
    };
  };

  const buildEndpoint = (tplOrFn, def) => {
    if (!tplOrFn) return (id) => `${fetchUrlBase}${def.replace(":id", id)}`;
    if (typeof tplOrFn === "function") return (id) => tplOrFn(id);
    return (id) => tplOrFn.replace(":id", id);
  };

  const joinUrlFor = buildEndpoint(joinEndpoint, "/communities/:id/join");
  const leaveUrlFor = buildEndpoint(leaveEndpoint, "/communities/:id/leave");

  const initialNormalized = normalize(initialCommunity);
  const idToFetch = propCommunityId ?? initialNormalized?._id;

  const [community, setCommunity] = useState(
    initialNormalized || {
      _id: idToFetch,
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

  // Fetch community
  useEffect(() => {
    if (!idToFetch || initialCommunity) return;

    let cancelled = false;

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    setLoading(true);

    fetch(`${fetchUrlBase}/communities/${idToFetch}`, { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load community");
        return res.json();
      })
      .then((raw) => {
        if (cancelled) return;
        const n = normalize(raw);
        setCommunity((c) => ({ ...c, ...n }));
      })
      .finally(() => !cancelled && setLoading(false));

    return () => (cancelled = true);
  }, [idToFetch, initialCommunity, fetchUrlBase]);

  const handleCreatePost = () => {
    if (!requireAuthOrRedirect(navigate)) return;
    navigate("/create-post", { state: { community } });
  };

  const handleJoinToggle = async () => {
    if (optimistic) return;
    if (!requireAuthOrRedirect(navigate)) return;

    const willJoin = !community.isMember;
    const endpoint = willJoin ? joinUrlFor(community._id) : leaveUrlFor(community._id);

    // optimistic UI
    setOptimistic(true);
    setCommunity((c) => ({
      ...c,
      isMember: willJoin,
      membersCount: c.membersCount + (willJoin ? 1 : -1),
    }));

    try {
      const token = localStorage.getItem("token");
      await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      setCommunity((c) => ({
        ...c,
        isMember: !willJoin,
        membersCount: c.membersCount + (willJoin ? -1 : 1),
      }));
    } finally {
      setOptimistic(false);
    }
  };

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
