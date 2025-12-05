import React from "react";
import { Continue, Input, Submit } from "./Components/components.js";
import "./Login.css";

function Login({ isOpen, onClose, onShowSignup, onShowReset }) {
  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close-btn" onClick={onClose}>
          ×
        </button>
        <h1 className="login-title">Log In</h1>
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
        <Continue
          text="Email me a one-time link"
          icon="/icons/Login/email.svg"
          link="#"
        />

        <span id="login-or">OR</span>

        <Input label="Email or username" required={true} />
        <Input label="Password" type="password" required={true} />

        <button className="subtitle-link-btn" onClick={onShowReset}>
          Forgot password?
        </button>

        <span className="subtitle">
          New to Reddit?{" "}
          <button className="login-links-btn" onClick={onShowSignup}>
            Sign Up
          </button>
        </span>

        <Submit text="Log In" />
      </div>
    </div>
  );
}

//export default Login;
