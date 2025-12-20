import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Login.css";
import {
  Logintitle,
  Loginparagraph,
  InputText,
  Submit,
} from "./components.js";
import { userApi } from "../../api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const disabled = password.trim() === "" || confirmPassword.trim() === "" || password !== confirmPassword;

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleResetPassword = async () => {
    if (disabled || !token) return;

    setIsLoading(true);
    setError("");

    try {
      await userApi.resetPassword(token, password);
      setSuccess(true);
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(msg);
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="All_login">
        <div className="login-container">
          <div className="login-notclose">
            <div className="logintile">
              <Logintitle text="Password Reset Successful" />
            </div>

            <div className="paragraphs">
              <Loginparagraph text="Your password has been successfully reset." />
              <br></br>
              <Loginparagraph text="You will be redirected to the login page shortly." />
            </div>

            <div className="submits">
              <Submit text="Go to Home" onClick={() => navigate('/')} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="All_login">
      <div className="login-container">
        <div className="login-notclose">
          <div className="logintile">
            <Logintitle text="Reset Your Password" />
          </div>

          <div className="paragraphs">
            <Loginparagraph text="Enter your new password below." />
          </div>

          <div className="inputs">
            <InputText
              label="New Password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setError("")}
            />

            <InputText
              label="Confirm New Password"
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setError("")}
            />
          </div>

          <div className="submits">
            <Submit
              text={isLoading ? "Resetting..." : "Reset Password"}
              disabled={disabled || isLoading || !token}
              onClick={handleResetPassword}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;