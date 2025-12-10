import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./allCommunities.css"; 

export default function allCommunities() {
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
    } catch (e) {
      return null;
    }
  };

  async function fetchUserMembershipsIfAny(token) {
    if (!token) return null;
    const candidateEndpoints = [
      `${API_BASE}/api/users/me/memberships`,
      `${API_BASE}/api/users/memberships`,
      `${API_BASE}/api/memberships`,
      `${API_BASE}/api/users/me/communities` 
    ];

    for (const url of candidateEndpoints) {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          continue;
        }
        const data = await res.json();
        if (Array.isArray(data)) return data;
      } catch (err) {
        console.debug("Membership endpoint attempt failed:", url, err);
      }
    }
    return null;
  }

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
        if (!res.ok) {
          throw new Error(`Failed to fetch communities (${res.status})`);
        }
        const data = await res.json();

        if (!mounted) return;
        setCommunities(data || []);

        const map = new Map();
        (data || []).forEach((c) => {
          const id = c._id || c.id || c.name;
          map.set(id, false);
        });
        setJoinedMap(map);

        const token = getToken();
        if (token) {
          try {
            const memberships = await fetchUserMembershipsIfAny(token);
            if (memberships && mounted) {
              const memberCommunityIds = new Set();
              memberships.forEach((m) => {
                if (!m) return;
                if (typeof m === "string") {
                  memberCommunityIds.add(m);
                } else if (m.communityId) {
                  memberCommunityIds.add(String(m.communityId));
                } else if (m.community && (m.community._id || m.community.id)) {
                  memberCommunityIds.add(String(m.community._id || m.community.id));
                } else if (m._id) {
                  memberCommunityIds.add(String(m._id));
                } else if (m.community) {
                  memberCommunityIds.add(String(m.community));
                }
              });

              if (memberCommunityIds.size > 0) {
                setJoinedMap((prev) => {
                  const copy = new Map(prev);
                  (data || []).forEach((c) => {
                    const id = c._id || c.id || c.name;
                    if (memberCommunityIds.has(String(id)) || memberCommunityIds.has(String(c.name))) {
                      copy.set(id, true);
                    }
                  });
                  return copy;
                });
              }
            }
          } catch (err) {
            console.debug("Failed to fetch memberships (optional):", err);
          }
        }
      } catch (err) {
        console.error("Error loading communities:", err);
        if (!mounted) return;
        setError(err.message || "Failed to load communities");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []); 

  async function joinCommunity(communityId) {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setActionLoading((prev) => {
      const copy = new Map(prev);
      copy.set(communityId, true);
      return copy;
    });

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
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error(body.message || `Join failed (${res.status})`);
      }

      setJoinedMap((prev) => {
        const copy = new Map(prev);
        copy.set(communityId, true);
        return copy;
      });
      setCommunities((prev) => prev.map((c) => (c._id === communityId || c.id === communityId ? { ...c, memberCount: (c.memberCount || 0) + 1 } : c)));
    } catch (err) {
      console.error("Join error", err);
      setError(err.message || "Failed to join community");
    } finally {
      setActionLoading((prev) => {
        const copy = new Map(prev);
        copy.set(communityId, false);
        return copy;
      });
    }
  }

  async function leaveCommunity(communityId) {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setActionLoading((prev) => {
      const copy = new Map(prev);
      copy.set(communityId, true);
      return copy;
    });

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
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error(body.message || `Leave failed (${res.status})`);
      }

      setJoinedMap((prev) => {
        const copy = new Map(prev);
        copy.set(communityId, false);
        return copy;
      });
      setCommunities((prev) => prev.map((c) => (c._id === communityId || c.id === communityId ? { ...c, memberCount: Math.max(0, (c.memberCount || 1) - 1) } : c)));
    } catch (err) {
      console.error("Leave error", err);
      setError(err.message || "Failed to leave community");
    } finally {
      setActionLoading((prev) => {
        const copy = new Map(prev);
        copy.set(communityId, false);
        return copy;
      });
    }
  }

  function toggleJoin(communityId, e) {
    e && e.stopPropagation();
    const token = getToken();
    const isJoined = !!joinedMap.get(communityId);

    if (!token) {
      navigate("/login");
      return;
    }

    if (isJoined) {
      leaveCommunity(communityId);
    } else {
      joinCommunity(communityId);
    }
  }

  function openCommunityPage(name) {
    if (!name) return;
    navigate(`/r/${name}`);
  }

  if (loading) {
    return (
      <div>
        <h1 style={{ textAlign: "center", margin: "18px 0" }}>All communities</h1>
        <div className="cc-empty">Loading communities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ textAlign: "center", margin: "18px 0" }}>All communities</h1>
        <div className="cc-empty">Error: {error}</div>
      </div>
    );
  }

  if (!communities || communities.length === 0) {
    return (
      <div>
        <h1 style={{ textAlign: "center", margin: "18px 0" }}>All communities</h1>
        <div className="cc-empty">No communities to show.</div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "18px 0" }}>All communities</h1>

      <div className="cc-grid">
        {communities.map((c) => {
          const id = c._id || c.id || c.name;
          const isJoined = !!joinedMap.get(id);
          const isActionLoading = !!actionLoading.get(id);
          const avatarLetter = c.name ? c.name[0].toUpperCase() : "?";

          return (
            <article
              key={id}
              className="cc-card"
              role="button"
              tabIndex={0}
              onClick={() => openCommunityPage(c.name)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openCommunityPage(c.name); }}
              aria-label={`Open community r/${c.name}`}
            >
              <div className="cc-avatar-wrap">
                {c.avatar ? (
                  <img
                    src={c.avatar}
                    alt={`r/${c.name} avatar`}
                    className="cc-avatar"
                    onError={(ev) => {
                      try {
                        ev.currentTarget.onerror = null;
                        ev.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(
                          `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23ddd'/><text x='50%' y='50%' font-size='20' dominant-baseline='middle' text-anchor='middle' fill='%23666'>${avatarLetter}</text></svg>`
                        )}`;
                      } catch (e) { /* ignore */ }
                    }}
                  />
                ) : (
                  <div className="cc-avatar-fallback">{avatarLetter}</div>
                )}
              </div>

              <div className="cc-body">
                <h3 className="cc-title">r/{c.name}</h3>
                <p className="cc-desc">{c.description || "No description provided."}</p>
                <p className="cc-meta">{(c.memberCount || 0) + " members"}</p>
              </div>

              <div className="cc-actions">
                <button
                  className={`cc-join-btn ${isJoined ? "joined" : "not-joined"}`}
                  onClick={(e) => toggleJoin(id, e)}
                  aria-pressed={isJoined}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? "..." : (isJoined ? "Joined" : "Join")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
