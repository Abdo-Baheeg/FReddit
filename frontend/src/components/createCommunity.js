import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADDED
import "./createCommunity.css";
import { communityApi } from "../api";

export default function CreateCommunityModal({ isOpen, onClose, onCreated }) {
  const navigate = useNavigate(); // ✅ ADDED

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rulesText, setRulesText] = useState("");
  const [ageVerified, setAgeVerified] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [bannerFile, setBannerFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bannerInputRef = useRef(null);
  const iconInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) resetAll();
  }, [isOpen]);

  function resetAll() {
    setName("");
    setDescription("");
    setRulesText("");
    setAgeVerified(false);
    setIsPublic(true);
    setBannerFile(null);
    setIconFile(null);
    setBannerPreview(null);
    setIconPreview(null);
    setStep(1);
    setLoading(false);
    setError(null);
  }

  function handleBannerChange(e) {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);

    if (!file) {
      setBannerPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setBannerPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleIconChange(e) {
    const file = e.target.files?.[0] || null;
    setIconFile(file);

    if (!file) {
      setIconPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setIconPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function validateStepOne() {
    if (!name.trim()) {
      setError("Community name is required.");
      return false;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStepTwo() {
    if (!ageVerified) {
      setError("You must confirm you are 18 years or older.");
      return false;
    }
    setError(null);
    return true;
  }

  const goNext = () => {
    if (step === 1 && !validateStepOne()) return;
    if (step === 2 && !validateStepTwo()) return;
    setStep((prev) => prev + 1);
  };

  const goPrev = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a community.");
      return;
    }

    setLoading(true);

    try {
      const rules = rulesText
        .split(/\r?\n/)
        .map((r) => r.trim())
        .filter(Boolean);

      const readFile = (file) =>
        new Promise((resolve) => {
          if (!file) return resolve(null);
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

      const bannerUrl = await readFile(bannerFile);
      const avatarUrl = await readFile(iconFile);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        rules,
        isPublic,
        ageVerified,
        bannerUrl,
        avatarUrl,
      };

      const createdCommunity = await communityApi.createCommunity(payload);

      onCreated && onCreated(createdCommunity);
      onClose && onClose();

      // ✅ ADDED — ensure creator enters the community
      navigate(`/community/${createdCommunity._id}`);
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError("Failed to create community.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create Community</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>

        <div className="steps-indicator" aria-hidden>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`step-dot ${step === n ? "active" : ""}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label>
                  Name <span>(r/...)</span>
                </label>
                <span className="input-prefix">r/</span>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label>Visibility</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <label>
                    <input
                      type="radio"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                    />{" "}
                    Public
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                    />{" "}
                    Private
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#f6f7f8",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={ageVerified}
                    onChange={(e) => setAgeVerified(e.target.checked)}
                    style={{
                      width: "16px",
                      height: "16px",
                      margin: 0,
                      cursor: "pointer",
                    }}
                  />
                  <span style={{ flex: 1 }}>
                    I confirm that I am 18 years or older
                  </span>
                </label>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="form-group">
              <label>Rules (optional)</label>
              <textarea
                rows={6}
                value={rulesText}
                onChange={(e) => setRulesText(e.target.value)}
              />
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <div className="form-group">
                <label>Banner (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={bannerInputRef}
                  onChange={handleBannerChange}
                />
                {bannerPreview && (
                  <div className="banner-preview">
                    <img src={bannerPreview} alt="banner" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Icon (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={iconInputRef}
                  onChange={handleIconChange}
                />
                {iconPreview && (
                  <div className="icon-preview">
                    <img src={iconPreview} alt="icon" />
                  </div>
                )}
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            {step > 1 && (
              <button type="button" className="cancel-button" onClick={goPrev}>
                Prev
              </button>
            )}

            {step < 4 && (
              <button type="button" className="create-button" onClick={goNext}>
                Next
              </button>
            )}

            {step === 4 && (
              <button type="submit" className="create-button" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
