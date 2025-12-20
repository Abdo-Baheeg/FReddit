import React, { useState, useEffect } from "react";
import "./Login.css";
import {
  Logintitle,
  Loginparagraph,
  Loginlink,
  InputText,
  Submit,
  CloseButton,
  BackButton,
} from "./components.js";
import { userApi } from "../../api";

const Reset = ({ setOpen }) => {
  const [username, setUsername] = useState("");
  const disabled = username.trim() === "";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (disabled) return;

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await userApi.forgotPassword(username);
      setSuccess(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Close this modal when a global close event is dispatched
  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("closeAllAuthWindows", handler);
    return () => window.removeEventListener("closeAllAuthWindows", handler);
  }, [setOpen]);

  return (
    <div className="login-container">
      <div className="login-overlay" onClick={() => setOpen(false)}>
        <div className="login-notclose" onClick={(e) => e.stopPropagation()}>
          <div className="my-window-close-button">
            <CloseButton onClose={() => setOpen(false)} />
          </div>

          <div className="my-window-back-button">
            <BackButton onClose={() => setOpen(false)} />
          </div>

          <div className="logintile">
            <Logintitle text="Reset your password" />
          </div>

          <div className="paragraphs">
            {success ? (
              <>
                <Loginparagraph text="We've sent you an email with a link to reset your password." />
                <br></br>
                <Loginparagraph text="Check your inbox and follow the instructions." />
              </>
            ) : (
              <>
                <Loginparagraph text="Enter your email address or username and we'll send you a" />
                <br></br>
                <Loginparagraph text="link to reset your password" />
              </>
            )}
          </div>

          {!success && (
            <div className="inputs">
              <InputText
                label="Email or Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setError("")}
              />
            </div>
          )}

          <>
            <Loginlink
              href="https://reddithelp.com/hc/sections/360008917491-Account-Security"
              data="Need help?"
            />
          </>
          <div className="submits">
            {success ? (
              <Submit
                text="Done"
                onClick={() => setOpen(false)}
              />
            ) : (
              <Submit
                text={isLoading ? "Sending..." : "Reset password"}
                disabled={disabled || isLoading}
                onClick={handleReset}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset;
