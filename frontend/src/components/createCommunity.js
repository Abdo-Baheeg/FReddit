import React, { useEffect, useState, useRef } from "react";
import { userApi } from "../api";
import { communityApi } from "../api";
import "./createCommunity.css";

export default function CreateCommunityModal({ isOpen, onClose, onCreated }) {
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
    const f = e.target.files && e.target.files[0];
    setBannerFile(f || null);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setBannerPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setBannerPreview(null);
    }
  }

  function handleIconChange(e) {
    const f = e.target.files && e.target.files[0];
    setIconFile(f || null);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setIconPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setIconPreview(null);
    }
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
    if (step === 1) {
      if (!validateStepOne()) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateStepTwo()) return;
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const goPrev = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  function buildPayload() {
    const rules = rulesText
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (bannerFile || iconFile) {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("description", description.trim());
      fd.append("isPublic", JSON.stringify(Boolean(isPublic)));
      fd.append("ageVerified", JSON.stringify(Boolean(ageVerified)));
      fd.append("rules", JSON.stringify(rules));
      if (bannerFile) fd.append("banner", bannerFile);
      if (iconFile) fd.append("icon", iconFile);
      return { body: fd, isFormData: true };
    }

    const json = {
      name: name.trim(),
      description: description.trim(),
      isPublic: Boolean(isPublic),
      ageVerified: Boolean(ageVerified),
      rules,
    };
    return { body: json, isFormData: false };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateStepOne()) {
      setStep(1);
      return;
    }
    if (!validateStepTwo()) {
      setStep(2);
      return;
    }

    const user = await userApi.getCurrentUser();
    if (typeof user !== "undefined" && !user) {
      setError("You must be logged in to create a community.");
      return;
    }

    setLoading(true);

    try {
      const { body, isFormData } = buildPayload();

      let res;
      if (isFormData) {
        res = await communityApi.post("/communities/create", body, {
          headers: { "Accept": "application/json" },
        });
      } else {
        res = await communityApi.createCommunity(name.trim(), description.trim(), isPublic, ageVerified, rulesText);
      }

      const created = res?.data?.community ?? res?.data ?? null;

      const createdFallback =
        created ||
        ({
          id: (res?.data?.id) || `local-${Date.now()}`,
          name: name.trim(),
          description: description.trim(),
          isPublic: Boolean(isPublic),
          rules: rulesText
            .split(/\r?\n/)
            .map((r) => r.trim())
            .filter((r) => r.length > 0),
          ageVerified: Boolean(ageVerified),
          banner: bannerPreview || null,
          icon: iconPreview || null,
          createdAt: new Date().toISOString(),
        });

      onCreated && onCreated(createdFallback);
      onClose && onClose();
      resetAll();
    } catch (err) {
      console.error("Create community error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create community";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <div
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Create community"
      >
        <div className="modal-container">
          <div className="modal-header">
            <h2>Create Community</h2>
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Close"
              disabled={loading}
            >
              ×
            </button>
          </div>

          <div className="steps-indicator" aria-hidden>
            <div className={`step-dot ${step === 1 ? "active" : ""}`}></div>
            <div className={`step-dot ${step === 2 ? "active" : ""}`}></div>
            <div className={`step-dot ${step === 3 ? "active" : ""}`}></div>
            <div className={`step-dot ${step === 4 ? "active" : ""}`}></div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <div className="form-group">
                  <label>
                    Name <span>(r/...)</span>
                  </label>
                  <span className="input-prefix">r/</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="community-name"
                    disabled={loading}
                    maxLength={60}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description"
                    rows={3}
                    disabled={loading}
                    maxLength={300}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="form-group">
                  <label>Visibility</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <label style={{ fontWeight: 600 }}>
                      <input
                        type="radio"
                        name="visibility"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        style={{ marginRight: 8 }}
                        disabled={loading}
                      />
                      Public
                    </label>
                    <label style={{ fontWeight: 600 }}>
                      <input
                        type="radio"
                        name="visibility"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        style={{ marginRight: 8 }}
                        disabled={loading}
                      />
                      Private
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={ageVerified}
                      onChange={(e) => setAgeVerified(e.target.checked)}
                      style={{ marginRight: 8 }}
                      disabled={loading}
                    />
                    I confirm I am 18 years of age or older (required)
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="form-group">
                  <label>
                    Rules (one per line) <span>(optional)</span>
                  </label>
                  <textarea
                    value={rulesText}
                    onChange={(e) => setRulesText(e.target.value)}
                    placeholder={"No spam\nBe kind\nStay on topic"}
                    rows={6}
                    disabled={loading}
                  />
                  <div className="input-help">
                    Each non-empty line will be saved as a rule.
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="form-group">
                  <label>Banner image (optional)</label>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    disabled={loading}
                  />
                  {bannerPreview && (
                    <div className="banner-preview">
                      <img src={bannerPreview} alt="banner preview" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Icon image (optional)</label>
                  <input
                    ref={iconInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    disabled={loading}
                  />
                  {iconPreview && (
                    <div className="icon-preview">
                      <img src={iconPreview} alt="icon preview" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              {step > 1 && (
                <button
                  type="button"
                  className="prev-button"
                  onClick={goPrev}
                  disabled={loading}
                >
                  Prev
                </button>
              )}

              {step < 4 && (
                <button
                  type="button"
                  className="next-button"
                  onClick={goNext}
                  disabled={loading}
                >
                  Next
                </button>
              )}

              {step === 4 && (
                <button
                  type="submit"
                  className="create-button"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
