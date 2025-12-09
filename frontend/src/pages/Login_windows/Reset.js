import React, { useState } from "react";
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

const Reset = ({ setOpen }) => {
  const [username, setUsername] = useState("");
  const disabled = username.trim() === "";

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
            <Loginparagraph text="Enter your email address or username and we’ll send you a" />
            <br></br>
            <Loginparagraph text="link to reset your password" />
          </div>

          <div className="inputs">
            <InputText
              label="Email or Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <>
            <Loginlink
              href="https://reddithelp.com/hc/sections/360008917491-Account-Security"
              data="Need help?"
            />
          </>
          <div className="submits">
            <Submit text="Reset password" disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset;
