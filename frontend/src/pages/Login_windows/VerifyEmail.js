import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Login.css";
import {
  Logintitle,
  Loginparagraph,
  Submit,
} from "./components.js";
import { userApi } from "../../api";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Invalid verification link.");
        setIsLoading(false);
        return;
      }

      try {
        await userApi.verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to verify email. Please try again.";
        setError(msg);
        console.error("Email verification error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (isLoading) {
    return (
      <div className="All_login">
        <div className="login-container">
          <div className="login-notclose">
            <div className="logintile">
              <Logintitle text="Verifying Email..." />
            </div>

            <div className="paragraphs">
              <Loginparagraph text="Please wait while we verify your email address." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="All_login">
        <div className="login-container">
          <div className="login-notclose">
            <div className="logintile">
              <Logintitle text="Email Verified Successfully" />
            </div>

            <div className="paragraphs">
              <Loginparagraph text="Your email has been successfully verified." />
              <br></br>
              <Loginparagraph text="You can now enjoy all features of FReddit." />
            </div>

            <div className="submits">
              <Submit text="Continue to FReddit" onClick={() => navigate('/')} />
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
            <Logintitle text="Email Verification Failed" />
          </div>

          <div className="paragraphs">
            <Loginparagraph text={error} />
            <br></br>
            <Loginparagraph text="Please try again or contact support if the problem persists." />
          </div>

          <div className="submits">
            <Submit text="Go to Home" onClick={() => navigate('/')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;