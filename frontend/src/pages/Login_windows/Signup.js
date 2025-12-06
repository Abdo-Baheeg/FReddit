import React, { useState } from "react";
import "./Login.css";
import {
  Logintitle,
  Loginparagraph,
  Loginlink,
  ContinueWithLink,
  ContinueWithWindow,
  OR,
  InputText,
  Submit,
  CloseButton,
  LoginMover,
} from "./components.js";
import Login from "./Login.js";

const Signup = ({ setOpen }) => {
  const [username, setUsername] = useState("");
  const disabled = username.trim() === "";
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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
            <Loginlink href="/terms" data="User Agreement" />
            <Loginparagraph text=" and " />
            <br></br>
            <Loginparagraph text="acknowledge that you understand the " />
            <Loginlink href="/privacy" data="Privacy Policy" />
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
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="forgot?">
            <Loginparagraph text="Already a reddittor? " />
            <LoginMover data="Log In" onOpen={() => setOpen(false)} />
            {isLoginOpen && <Login setOpen={setIsLoginOpen} />}
          </div>

          <div className="submits">
            <Submit text="Continue" disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
