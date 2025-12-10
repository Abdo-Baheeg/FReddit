import React, { useEffect, useState, useCallback } from "react";
import CreateCommunityModal from "./CreateCommunityModal";
import api from "../services/apiClient";
import "./allCommunities.css";

export default function CommunitiesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommunities = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      // axios supports AbortController `signal` (axios v1+)
      const res = await api.get("/communities", { signal });
      const data = res?.data?.data ?? res?.data ?? [];
      setCommunities(Array.isArray(data) ? data : []);
    } catch (err) {
      // If aborted, just return silently
      if (err?.name === "CanceledError" || err?.name === "AbortError") {
        return;
      }
      console.error("Failed to fetch communities:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load communities. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchCommunities(ac.signal);
    return () => {
      ac.abort();
    };
  }, [fetchCommunities]);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h1 style={{ margin: 0 }}>Communities</h1>
        <button onClick={() => setModalOpen(true)} aria-haspopup="dialog">
          Create Community
        </button>
      </div>

      {loading ? (
        <div role="status" aria-live="polite">
          Loading communities…
        </div>
      ) : error ? (
        <div style={{ color: "var(--error, #b00020)" }} role="alert">
          <div>{error}</div>
          <div>
            <button
              onClick={() => {
                const ac = new AbortController();
                fetchCommunities(ac.signal);
              }}
              style={{ marginTop: 8 }}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <ul>
          {communities.length === 0 && <li>No communities yet.</li>}
          {communities.map((c) => (
            <li key={c._id || c.id} style={{ marginBottom: 12 }}>
              <strong>{`r/${c.name}`}</strong>
              <div>{c.description || "No description"}</div>
              {Array.isArray(c.rules) && c.rules.length > 0 && (
                <details>
                  <summary>Rules ({c.rules.length})</summary>
                  <ol>
                    {c.rules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ol>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}

      <CreateCommunityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(created) => {
          // optimistic update — prepend new community if it has an id or name
          if (!created) {
            setModalOpen(false);
            return;
          }
          setCommunities((prev) => {
            const id = created._id || created.id;
            const exists = id
              ? prev.some((p) => (p._id || p.id) === id)
              : prev.some((p) => p.name === created.name);
            if (exists) return prev;
            return [created, ...prev];
          });
          setModalOpen(false);
        }}
      />
    </div>
  );
}
