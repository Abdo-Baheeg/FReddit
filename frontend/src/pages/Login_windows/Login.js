import React, { useState } from "react";
import "./Login.css";
import Signup from "./Signup.js";
import {
  Logintitle,
  Loginparagraph,
  Loginlink,
  ContinueWith,
  OR,
  InputText,
  Submit,
  CloseButton,
  LoginMover,
} from "./components.js";

const Login = ({ setOpen }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // لو الاتنين فاضيين → disabled
  const disabled = username.trim() === "" || password.trim() === "";
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  return (
    <div className="login-container">
      <div className="login-overlay" onClick={() => setOpen(false)}>
        <div className="login-notclose" onClick={(e) => e.stopPropagation()}>
          <div className="my-window-close-button">
            <CloseButton onClose={() => setOpen(false)} />
          </div>

          <div className="logintile">
            <Logintitle text="Log In" />
          </div>

          <div className="paragraphs">
            <Loginparagraph text="By continuing, you agree to our " />
            <Loginlink href="/terms" data="User Agreement" />
            <Loginparagraph text=" and " />
            <br></br>
            <Loginparagraph text="acknowledge that you understand the " />
            <Loginlink href="/privacy" data="Privacy Policy" />
            <Loginparagraph text=" ." />
          </div>

          <div className="continues">
            <ContinueWith
              text="Continue with Phone Number"
              icon="/icons/login/phonenumber.svg"
            />
            <ContinueWith
              text="Continue with Google"
              icon="/icons/login/google.svg"
            />
            <ContinueWith
              text="Continue with Apple"
              icon="/icons/login/apple.svg"
            />
            <ContinueWith
              text="Email me with a one-time link"
              icon="/icons/login/email.svg"
            />
          </div>

          <div className="OR">
            <OR />
          </div>

          <div className="inputs">
            <InputText
              label="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <InputText
              label="Password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot?">
            <LoginMover href="/forgot-password" data="Forgot password?" />
          </div>

          <div className="forgot?">
            <Loginparagraph text="New to Reddit? " />
            <LoginMover data="Sign Up" onOpen={() => setIsSignupOpen(true)} />
            {isSignupOpen && <Signup setOpen={setIsSignupOpen} />}
          </div>

          <div className="submits">
            <Submit text="Log In" disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
