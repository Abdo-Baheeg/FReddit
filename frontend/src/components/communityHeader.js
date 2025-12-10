import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./communityHeader.css";

export function requireAuthOrRedirect(navigate) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return false;
    }
    return true;
  } catch (err) {
    navigate("/login");
    return false;
  }
}

export default function CommunityHeader({
  communityId,
  initialCommunity = null,
  fetchUrlBase = "/api",
  joinEndpoint,
  leaveEndpoint,
}) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <HeaderContent
        communityId={communityId}
        initialCommunity={initialCommunity}
        fetchUrlBase={fetchUrlBase}
        joinEndpoint={joinEndpoint}
        leaveEndpoint={leaveEndpoint}
      />
    </div>
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

  // UI states
  const [community, setCommunity] = useState(
    initialCommunity ?? {
      _id: propCommunityId ?? "local-community",
      name: "example",
      description: "This is a sample community rendered without backend.",
      coverImageUrl: fallbackBanner,
      avatarUrl: fallbackAvatar,
      membersCount: 0,
      postsCount: 0,
      isMember: false,
    }
  );
  const [loading, setLoading] = useState(!!(propCommunityId && !initialCommunity));
  const [error, setError] = useState(null);
  const [optimistic, setOptimistic] = useState(false); // to block double-clicks

  const normalize = (raw) => {
    if (!raw) return null;
    return {
      _id: raw._id || raw.id || raw.communityId,
      name: raw.name || raw.slug || raw.title || "community",
      description: raw.description || raw.bio || "",
      coverImageUrl: raw.coverImageUrl || raw.banner || raw.cover || fallbackBanner,
      avatarUrl: raw.avatarUrl || raw.image || raw.icon || fallbackAvatar,
      membersCount:
        typeof raw.membersCount === "number"
          ? raw.membersCount
          : Array.isArray(raw.members)
          ? raw.members.length
          : raw.members || 0,
      postsCount: raw.postsCount ?? raw.postCount ?? raw.posts ?? 0,
      isMember: !!raw.isMember || !!raw.currentUserIsMember || false,
    };
  };

  // Build endpoint helpers (allow string templates or functions)
  const buildEndpoint = (tplOrFn, defaultTpl) => {
    if (!tplOrFn) return (id) => `${fetchUrlBase}${defaultTpl.replace(":id", id)}`;
    if (typeof tplOrFn === "function") return (id) => tplOrFn(id);
    return (id) => tplOrFn.replace(":id", id);
  };

  const fetchCommunityEndpoint = (id) => `${fetchUrlBase}/communities/${id}`;
  const joinUrlFor = buildEndpoint(joinEndpoint, "/communities/:id/join");
  const leaveUrlFor = buildEndpoint(leaveEndpoint, "/communities/:id/leave");

  // Fetch community if we have an id but no initialCommunity
  useEffect(() => {
    let cancelled = false;
    if (!propCommunityId || initialCommunity) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    fetch(fetchCommunityEndpoint(propCommunityId), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to load community (${res.status})`);
        }
        return res.json();
      })
      .then((raw) => {
        if (cancelled) return;
        const n = normalize(raw);
        if (n) setCommunity((c) => ({ ...c, ...n }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("CommunityHeader fetching community failed:", err);
        setError(err.message || "Failed to load community");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [propCommunityId, initialCommunity, fetchUrlBase]);

  const handleCreatePost = useCallback(() => {
    if (!requireAuthOrRedirect(navigate)) return;
    navigate("/create-post", { state: { community } });
  }, [navigate, community]);

  const handleJoinToggle = useCallback(async () => {
    if (optimistic) return;
    if (!community || !community._id) return;

    if (!requireAuthOrRedirect(navigate)) return;

    const id = community._id;
    const willJoin = !community.isMember;

    setCommunity((c) => ({
      ...c,
      isMember: willJoin,
      membersCount: Math.max(0, (c.membersCount || 0) + (willJoin ? 1 : -1)),
    }));
    setOptimistic(true);

    const endpoint = willJoin ? joinUrlFor(id) : leaveUrlFor(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ communityId: id }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Server error ${res.status}`);
      }

      const body = await res.json().catch(() => null);
      if (body) {
        const n = normalize(body);
        if (n) setCommunity((c) => ({ ...c, ...n }));
      }
    } catch (err) {
      console.warn("Join/Leave request failed:", err);
      setCommunity((c) => ({
        ...c,
        isMember: !willJoin,
        membersCount: Math.max(0, (c.membersCount || 0) + (willJoin ? -1 : 1)),
      }));

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("notify", {
            detail: {
              type: "error",
              message: err.message || "Failed to update membership",
            },
          })
        );
      }
    } finally {
      setOptimistic(false);
    }
  }, [community, optimistic, joinUrlFor, leaveUrlFor, navigate]);

  return (
    <header className="subreddit-header" aria-busy={loading}>
      <div
        className="subreddit-banner"
        style={{ backgroundImage: `url(${community.coverImageUrl || fallbackBanner})` }}
      >
        <div className="banner-overlay" />
      </div>

      <div className="subreddit-info-wrapper">
        <div className="subreddit-info">
          <img
            src={community.avatarUrl || fallbackAvatar}
            alt={`${community.name} avatar`}
            className="subreddit-avatar"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackAvatar;
            }}
          />

          <div className="subreddit-text">
            <h1>{community.name ? `r/${community.name}` : "r/community"}</h1>
            <p>{community.description}</p>
            <div className="subreddit-meta">
              <span>{Number(community.membersCount || 0).toLocaleString()} members</span>
              <span className="dot">•</span>
              <span>{Number(community.postsCount || 0).toLocaleString()} posts</span>
            </div>
            {error && <div className="subreddit-error">Error: {error}</div>}
          </div>

          <div className="subreddit-actions">
            <button onClick={handleCreatePost} disabled={loading}>
              + Create Post
            </button>
            <button
              onClick={handleJoinToggle}
              disabled={loading || optimistic}
              aria-pressed={community.isMember}
            >
              {community.isMember ? "Joined" : "Join"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
