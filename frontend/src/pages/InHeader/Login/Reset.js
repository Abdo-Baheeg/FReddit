import React from "react";
import { Input, Submit } from "./Components/components.js";
import "./Login.css";

function Reset({ isOpen, onClose, onShowLogin }) {
  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-back-btn" onClick={onShowLogin}>
          ←
        </button>
        <button className="login-close-btn" onClick={onClose}>
          ×
        </button>
        <h1 className="login-title">Reset Password</h1>

        <span className="subtitle">
          Enter your email address or username and we’ll send you a link to
          reset your password
        </span>

        <Input label="Email or username" required={true} />

        <a href="#">
          <span className="subtitle">Need help?</span>
        </a>

        <span className="subtitle">
          Remember your password?{" "}
          <button className="login-links-btn" onClick={onShowLogin}>
            Log In
          </button>
        </span>

        <Submit text="Reset Password" />
      </div>
    </div>
  );
}

export default Reset;
