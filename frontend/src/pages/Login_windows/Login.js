import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Signup from "./Signup.js";
import Reset from "./Reset.js";
import Emailme from "./Emailme.js";
import {
  Logintitle,
  Loginparagraph,
  Loginlink,
  ContinueWithLink,
  OR,
  InputText,
  Submit,
  CloseButton,
  LoginMover,
} from "./components.js";
import { userApi } from "../../api";

const Login = ({ setOpen }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Both are Empty → disabled
  const disabled = username.trim() === "" || password.trim() === "";
  // Modals State
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isEmailmeOpen, setIsEmailmeOpen] = useState(false);

  // Login state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (disabled) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await userApi.login(username, password);

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Close the modal
      setOpen(false);

      // Navigate to home and reload to update navbar/sidebar
      navigate("/");
      window.location.reload();
    } catch (err) {
      // show a user-friendly message on login failure
      setError("Invalid email or password");
      console.error("Login error:", err);
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

  // Prevent background scrolling and interactions when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="All_login">
      <div className="login-container">
        <div className="login-overlay">
          <div className="login-notclose" onClick={(e) => e.stopPropagation()}>
            <div className="my-window-close-button">
              <CloseButton onClose={() => setOpen(false)} />
            </div>

            <div className="logintile">
              <Logintitle text="Log In" />
            </div>

            <div className="paragraphs">
              <Loginparagraph text="By continuing, you agree to our " />
              <Loginlink
                href="https://redditinc.com/policies/user-agreement"
                data="User Agreement"
              />
              <Loginparagraph text=" and " />
              <br></br>
              <Loginparagraph text="acknowledge that you understand the " />
              <Loginlink
                href="https://redditinc.com/policies/privacy-policy"
                data="Privacy Policy"
              />
              <Loginparagraph text=" ." />
            </div>

            <div className="continues">
              <ContinueWithLink
                text="Continue with Phone Number"
                icon="/icons/login/phonenumber.svg"
              />
              <ContinueWithLink
                text="Continue with Google"
                icon="/icons/login/google.svg"
              />
              <ContinueWithLink
                text="Continue with Apple"
                icon="/icons/login/apple.svg"
              />
              <ContinueWithLink
                text="Email me with a one-time link"
                icon="/icons/login/email.svg"
              />
              {isEmailmeOpen && <Emailme setOpen={setIsEmailmeOpen} />}
            </div>

            <div className="OR">
              <OR />
            </div>

            <div className="inputs">
              <InputText
                label="Email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                onFocus={() => setError("")}
              />

              <InputText
                label="Password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setError("")}
              />
            </div>

            <div className="forgot?">
              <LoginMover
                data="Forgot password?"
                onOpen={() => setIsResetOpen(true)}
              />
              {isResetOpen && <Reset setOpen={setIsResetOpen} />}
            </div>

            <div className="forgot?">
              <Loginparagraph text="New to Reddit? " />
              <LoginMover data="Sign Up" onOpen={() => setIsSignupOpen(true)} />
              {isSignupOpen && <Signup setOpen={setIsSignupOpen} />}
            </div>
            <div className="submits">
              <Submit
                text={isLoading ? "Logging In..." : "Log In"}
                disabled={disabled || isLoading}
                onClick={handleLogin}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
