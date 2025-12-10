import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./allCommunities.css";

export default function AllCommunities() {
  const navigate = useNavigate();

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [joinedMap, setJoinedMap] = useState(new Map());

  const [actionLoading, setActionLoading] = useState(new Map());

  const API_BASE = "http://localhost:5050";

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
        const res = await fetch(`${API_BASE}/api/communities`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error("Failed to load communities.");

        const data = await res.json();
        if (!mounted) return;

        setCommunities(data);

        const tempMap = new Map();
        data.forEach((c) => {
          const id = c._id;
          tempMap.set(id, false);   
        });
        setJoinedMap(tempMap);

        const token = getToken();
        if (token) {
          try {
            const membershipRes = await fetch(`${API_BASE}/api/memberships/check-all`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });

            if (membershipRes.ok) {
              const membershipData = await membershipRes.json();
              const memberIds = new Set(membershipData.map((m) => String(m.communityId)));

              setJoinedMap((prev) => {
                const copy = new Map(prev);
                data.forEach((c) => {
                  if (memberIds.has(String(c._id))) {
                    copy.set(c._id, true);
                  }
                });
                return copy;
              });
            }
          } catch {
            /* ignore */
          }
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
    const token = getToken();
    if (!token) return navigate("/login");

    setActionLoading((prev) => new Map(prev).set(communityId, true));

    try {
      const res = await fetch(`${API_BASE}/api/communities/${communityId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const body = await res.json();

      if (!res.ok) {
        if (res.status === 401) return navigate("/login");
        throw new Error(body.message || "Join failed");
      }

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
      setError(err.message);
    } finally {
      setActionLoading((prev) => new Map(prev).set(communityId, false));
    }
  }

  async function leaveCommunity(communityId) {
    const token = getToken();
    if (!token) return navigate("/login");

    setActionLoading((prev) => new Map(prev).set(communityId, true));

    try {
      const res = await fetch(`${API_BASE}/api/communities/${communityId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const body = await res.json();
      if (!res.ok) {
        if (res.status === 401) return navigate("/login");
        throw new Error(body.message || "Leave failed");
      }

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
      setError(err.message);
    } finally {
      setActionLoading((prev) => new Map(prev).set(communityId, false));
    }
  }

  function toggleJoin(communityId, e) {
    e.stopPropagation(); 

    const token = getToken();
    if (!token) return navigate("/login");

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
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>All Communities</h1>

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
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openCommunityPage(communityId);
              }}
            >
              <div className="cc-avatar-wrap">
                <div className="cc-avatar-fallback">{avatarLetter}</div>
              </div>

              <div className="cc-body">
                <h3 className="cc-title">r/{c.name}</h3>
                <p className="cc-desc">{c.description || "No description provided."}</p>
                <p className="cc-meta">{c.memberCount} members</p>
              </div>

              <div className="cc-actions">
                <button
                  className={`cc-join-btn ${isJoined ? "joined" : "not-joined"}`}
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
