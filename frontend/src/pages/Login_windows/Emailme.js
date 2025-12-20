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

  const handleContinue = () => {
    // This feature is not implemented yet
    alert("Magic link login is not available yet. Please use regular login.");
    setOpen(false);
  };

  return (
    <div className="login-container">
      <div className="login-overlay" onClick={() => setOpen(false)}>
        <div className="login-notclose" onClick={(e) => e.stopPropagation()}>
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
            <Submit text="Continue" disabled={disabled} onClick={handleContinue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emailme;
