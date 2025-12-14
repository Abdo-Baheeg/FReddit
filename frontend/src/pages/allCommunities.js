import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./allCommunities.css";

// ✅ CENTRAL API IMPORTS ONLY
import { communityApi, membershipApi } from "../api";

export default function AllCommunities() {
  const navigate = useNavigate();

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [joinedMap, setJoinedMap] = useState(new Map());
  const [actionLoading, setActionLoading] = useState(new Map());

 

  const getToken = () => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        // ✅ 1. Load all communities
        const communityData = await communityApi.getAllCommunities();
        if (!mounted) return;

        setCommunities(communityData);

        // init joined map (default false)
        const tempMap = new Map();
        communityData.forEach((c) => tempMap.set(c._id, false));
        setJoinedMap(tempMap);

        // ✅ 2. Load user memberships (if logged in)
        try {
          const memberships = await membershipApi.getUserMemberships();
          const memberIds = new Set(
            memberships.map((m) => String(m.communityId))
          );

          setJoinedMap((prev) => {
            const copy = new Map(prev);
            communityData.forEach((c) => {
              if (memberIds.has(String(c._id))) {
                copy.set(c._id, true);
              }
            });
            return copy;
          });
        } catch {
          // user not logged in → ignore
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load communities");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  async function joinCommunity(communityId) {
    setActionLoading((prev) => new Map(prev).set(communityId, true));

    try {
      await membershipApi.join(communityId);

      setJoinedMap((prev) => {
        const copy = new Map(prev);
        copy.set(communityId, true);
        return copy;
      });

      setCommunities((prev) =>
        prev.map((c) =>
          c._id === communityId
            ? { ...c, memberCount: (c.memberCount || 0) + 1 }
            : c
        )
      );
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login");
      } else {
        setError(err.message || "Join failed");
      }
    } finally {
      setActionLoading((prev) => new Map(prev).set(communityId, false));
    }
  }

  async function leaveCommunity(communityId) {
    setActionLoading((prev) => new Map(prev).set(communityId, true));

    try {
      await membershipApi.leave(communityId);

      setJoinedMap((prev) => {
        const copy = new Map(prev);
        copy.set(communityId, false);
        return copy;
      });

      setCommunities((prev) =>
        prev.map((c) =>
          c._id === communityId
            ? { ...c, memberCount: Math.max(0, c.memberCount - 1) }
            : c
        )
      );
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login");
      } else {
        setError(err.message || "Leave failed");
      }
    } finally {
      setActionLoading((prev) => new Map(prev).set(communityId, false));
    }
  }

  function toggleJoin(communityId, e) {
    e.stopPropagation();

    const isJoined = joinedMap.get(communityId);
    if (isJoined) leaveCommunity(communityId);
    else joinCommunity(communityId);
  }

  function openCommunityPage(communityId) {
    navigate(`/community/${communityId}`);
  }

  if (loading)
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>All Communities</h1>
        <div className="cc-empty">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>All Communities</h1>
        <div className="cc-empty">Error: {error}</div>
      </div>
    );

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        All Communities
      </h1>

      <div className="cc-grid">
        {communities.map((c) => {
          const communityId = c._id;
          const isJoined = joinedMap.get(communityId);
          const loadingAction = actionLoading.get(communityId);
          const avatarLetter = c.name ? c.name[0].toUpperCase() : "?";

          return (
            <article
              key={communityId}
              className="cc-card"
              onClick={() => openCommunityPage(communityId)}
              role="button"
              tabIndex={0}
            >
              <div className="cc-avatar-wrap">
                <div className="cc-avatar-fallback">{avatarLetter}</div>
              </div>

              <div className="cc-body">
                <h3 className="cc-title">r/{c.name}</h3>
                <p className="cc-desc">
                  {c.description || "No description provided."}
                </p>
                <p className="cc-meta">{c.memberCount} members</p>
              </div>

              <div className="cc-actions">
                <button
                  className={`cc-join-btn ${
                    isJoined ? "joined" : "not-joined"
                  }`}
                  disabled={loadingAction}
                  onClick={(e) => toggleJoin(communityId, e)}
                >
                  {loadingAction ? "..." : isJoined ? "Leave" : "Join"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
