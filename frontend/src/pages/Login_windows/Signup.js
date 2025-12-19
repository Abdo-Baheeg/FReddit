import React, { useState, useEffect } from "react";
import "./Login.css";
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
import Login from "./Login.js";
import SignupP2 from "./SignupP2.js";
import SignupSuccess from "./SignupSuccess.js";

const Signup = ({ setOpen }) => {
  const [username, setUsername] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const disabled = !emailRegex.test(username);
  const [error, setError] = useState("");
  // Modals State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupP2Open, setIsSignupP2Open] = useState(false);
  const [isSignupSuccessOpen, setIsSignupSuccessOpen] = useState(false);

  const handleSignupSuccess = () => {
    // close P2 if open, open success window
    setIsSignupP2Open(false);
    setIsSignupSuccessOpen(true);
    setIsLoginOpen(false);
    setError("");
  };

  const handleCloseSuccess = () => {
    setIsSignupSuccessOpen(false);
    setOpen(false);
  };

  // listen for global close events (e.g., X clicked in other windows)
  useEffect(() => {
    const handler = () => {
      setIsSignupP2Open(false);
      setOpen(false);
      setIsLoginOpen(false);
      setError("");
    };
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

          <div className="logintile">
            <Logintitle text="Sign Up" />
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
          </div>

          <div className="forgot?">
            <Loginparagraph text="Already a reddittor? " />
            <LoginMover data="Log In" onOpen={() => setOpen(false)} />
            {isLoginOpen && <Login setOpen={setIsLoginOpen} />}
          </div>

          <div className="submits">
            <Submit
              text="Continue"
              disabled={disabled}
              onClick={() => setIsSignupP2Open(true)}
              error={error}
            />
            {isSignupP2Open && (
              <SignupP2
                setOpen={setIsSignupP2Open}
                email={username}
                onSignupSuccess={handleSignupSuccess}
              />
            )}
            {isSignupSuccessOpen && (
              <SignupSuccess setOpen={handleCloseSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
