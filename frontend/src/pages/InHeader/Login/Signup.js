import React from "react";
import { Continue, Input, Submit } from "./Components/components.js";
import "./Login.css";

function Signup({ isOpen, onClose, onShowLogin }) {
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
        <h1 className="login-title">Sign Up</h1>
        <span className="subtitle">
          By continuing, you agree to our{" "}
          <a href="#">
            <span className="login-links">User Agreement</span>
          </a>
          and acknowledge that you understand the{" "}
          <a href="#">
            <span className="login-links">Privacy Policy</span>
          </a>
          .
        </span>
        <Continue
          text="Continue with Phone Number"
          icon="/icons/Login/phonenumber.svg"
          link="#"
        />
        <Continue
          text="Continue with Google"
          icon="/icons/Login/google.svg"
          link="#"
        />
        <Continue
          text="Continue with Apple"
          icon="/icons/Login/apple.svg"
          link="#"
        />
        <span id="login-or">OR</span>

        <Input label="Email" required={true} />

        <span className="subtitle">
          Already a Redditor?{" "}
          <button className="login-links-btn" onClick={onShowLogin}>
            Log In
          </button>
        </span>
        <Submit text="Continue" />
      </div>
    </div>
  );
}

export default Signup;
