import React, { useState } from "react";
import "./Login.css";
import {
  Logintitle,
  Loginparagraph,
  InputText,
  Submit,
  CloseButton,
  BackButton,
} from "./components.js";

const Emailme = ({ setOpen }) => {
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
            <Logintitle text="Email me a one-time link to login " />
          </div>

          <div className="paragraphs">
            <Loginparagraph text="Where should we send the link to?" />
          </div>

          <div className="inputs">
            <InputText
              label="Email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="submits">
            <Submit text="Continue" disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emailme;
