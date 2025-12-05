import React, { useState } from "react";
import "./Login.css";
import {
  Logintitle,
  Loginparagraph,
  Loginlink,
  ContinueWith,
  OR,
  InputText,
  Submit,
  CloseButton,
} from "./components.js";

const Signup = ({ setOpen }) => {
  const [username, setUsername] = useState("");
  const disabled = username.trim() === "";
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
