import React from "react";
import { useNavigate } from "react-router-dom";
import "./privateCommunityGate.css";

export default function PrivateCommunityGate({
  community,
  isLoggedIn,
  isMember,
  onJoin
}) {
  const navigate = useNavigate();

  if (!community) return null;

  if (community.isPublic || isMember) return null;

  return (
    <div className="gate-overlay">
      <div className="gate-modal">
        <div className="gate-header">
          <div className="gate-avatar">
            {community.name[0].toUpperCase()}
          </div>
          <h2>{community.name}</h2>
        </div>

        <p className="gate-text">
          This is a private community.
          <br />
          Only approved members can view and participate.
        </p>

        <div className="gate-actions">
          <button
            className="gate-secondary"
            onClick={() => navigate("/")}
          >
            Go to Homepage
          </button>

          {isLoggedIn && (
            <button
              className="gate-primary"
              onClick={onJoin}
            >
              Join Community
            </button>
          )}
        </div>

        {!isLoggedIn && (
          <p className="gate-hint">
            You must be logged in to join this community.
          </p>
        )}
      </div>
    </div>
  );
}
