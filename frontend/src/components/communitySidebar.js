import React, { useEffect, useMemo, useState } from "react";
import "./communitySidebar.css";
import PropTypes from "prop-types";

let api;
try {
  api = require("./api").default;
} catch {
  api = require("axios").create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
    headers: { "Content-Type": "application/json" },
  });
}

export default function CommunitySidebar({ community, currentUser }) {
  const [openRules, setOpenRules] = useState({});
  const [modsLoading, setModsLoading] = useState(false);
  const [resolvedModerators, setResolvedModerators] = useState([]);

  if (!community) return null;

  const membersCount = useMemo(() => {
    if (Array.isArray(community.members)) return community.members.length;
    return community.membersCount ?? 0;
  }, [community]);

  const communityAvatar =
    community.avatarUrl || community.avatar_url || "/default-community.png";

  const moderators = Array.isArray(community.moderators)
    ? community.moderators
    : [];

  const displayModerators = resolvedModerators.slice(0, 6);

  const formatCompactNumber = (n) => {
    if (n == null) return "—";
    if (n < 1000) return String(n);
    const units = ["K", "M", "B"];
    let u = -1;
    let v = n;
    while (v >= 1000 && u < units.length - 1) {
      v /= 1000;
      u++;
    }
    return `${Math.round(v * 10) / 10}${units[u] ?? ""}`;
  };

  const formatCreated = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const toggleRule = (idx) =>
    setOpenRules((prev) => ({ ...prev, [idx]: !prev[idx] }));

  useEffect(() => {
    const fetchModerators = async () => {
      if (moderators.length === 0) {
        setResolvedModerators([]);
        return;
      }

      const communityId = community._id || community.id;
      setModsLoading(true);

      try {
        const res = await api.get(`/api/communities/${communityId}/moderators`);
        setResolvedModerators(res.data || []);
      } catch {
        setResolvedModerators(
          moderators.map((m) =>
            typeof m === "string" ? { username: m } : m
          )
        );
      } finally {
        setModsLoading(false);
      }
    };

    fetchModerators();
  }, [community._id, JSON.stringify(moderators)]);

  return (
    <aside className="cs-root">
      <div className="cs-box">
        <div className="cs-stats-card">
          <div className="cs-stats-header">
            <img
              className="cs-small-avatar"
              src={communityAvatar}
              alt="community avatar"
              onError={(e) => (e.currentTarget.src = "/default-community.png")}
            />

            <div className="cs-stats-headline">
              <div className="cs-community-name">r/{community.name}</div>
              <div className="cs-community-sub">{community.description}</div>
            </div>
          </div>

          <div className="cs-stats-grid">
            <div className="cs-stat-item">
              <div className="cs-stat-num">{formatCreated(community.createdAt)}</div>
              <div className="cs-stat-label">Created</div>
            </div>

            <div className="cs-stat-item">
              <div className="cs-stat-num">
                {community.isPublic ? "Public" : "Private"}
              </div>
              <div className="cs-stat-label">Community type</div>
            </div>

            <div className="cs-stat-item">
              <div className="cs-stat-num">
                {formatCompactNumber(community.weeklyVisitors)}
              </div>
              <div className="cs-stat-label">Weekly visitors</div>
            </div>

            <div className="cs-stat-item">
              <div className="cs-stat-num">
                {formatCompactNumber(community.weeklyContributions)}
              </div>
              <div className="cs-stat-label">Weekly contributions</div>
            </div>
          </div>

          <div className="cs-members-line">
            <div>
              <div className="cs-members-count">
                {formatCompactNumber(membersCount)}
              </div>
              <div className="cs-members-label">Members</div>
            </div>

            {}
          </div>
        </div>

        {/* USER FLAIR */}
        <div className="cs-user-flair">
          <div className="cs-user-top">
            <img
              src={currentUser?.avatar_url || "/default-avatar.png"}
              alt="you"
              onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
            />
            <div>
              <div className="cs-flair-label">USER FLAIR</div>
              <div className="cs-flair-chip">
                {currentUser?.flair ||
                  currentUser?.username ||
                  "Available"}
              </div>
            </div>
          </div>
        </div>

        <div className="cs-divider" />

        {/* RULES */}
        <div className="cs-section">
          <div className="cs-section-title">
            R/{String(community.name).toUpperCase()} RULES
          </div>

          {Array.isArray(community.rules) && community.rules.length ? (
            community.rules.map((rule, idx) => {
              const title = rule.title || rule;
              const desc = rule.description || rule;
              const open = !!openRules[idx];
              return (
                <div className="cs-rule" key={idx}>
                  <button
                    className="cs-rule-toggle"
                    onClick={() => toggleRule(idx)}
                  >
                    <span className="cs-rule-index">{idx + 1}</span>
                    <span className="cs-rule-title">{title}</span>
                    <span className="cs-rule-chevron">{open ? "▾" : "▸"}</span>
                  </button>

                  {open && <div className="cs-rule-desc">{desc}</div>}
                </div>
              );
            })
          ) : (
            <div className="cs-muted">No rules set for this community.</div>
          )}
        </div>

        <div className="cs-divider" />

        {/* MODERATORS */}
        <div className="cs-section">
          <div className="cs-section-title">MODERATORS</div>

          {modsLoading ? (
            <div className="cs-muted">Loading moderators…</div>
          ) : displayModerators.length === 0 ? (
            <div className="cs-muted">No moderators listed.</div>
          ) : (
            displayModerators.map((m, i) => {
              const username = m.username || m.name || "u/unknown";
              const avatar =
                m.avatar_url || m.avatar || "/default-avatar.png";

              return (
                <div className="cs-mod-item" key={i}>
                  <img
                    src={avatar}
                    alt={username}
                    onError={(e) =>
                      (e.currentTarget.src = "/default-avatar.png")
                    }
                  />
                  <div className="cs-mod-meta">
                    <div className="cs-mod-name">{username}</div>
                    {m.flair && <div className="cs-mod-flair">{m.flair}</div>}
                  </div>
                </div>
              );
            })
          )}

          {}
        </div>
      </div>
    </aside>
  );
}

CommunitySidebar.propTypes = {
  community: PropTypes.object,
  currentUser: PropTypes.object,
};
