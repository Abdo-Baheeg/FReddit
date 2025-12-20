import React, { useEffect } from "react";
import "./Login.css";
import {
  Logintitle,
  Loginparagraph,
  Submit
} from "./components.js";

const SignupSuccess = ({ setOpen }) => {
  return (
    <div className="login-container">
      <div className="login-overlay">
        <div className="login-notclose" onClick={(e) => e.stopPropagation()}>
          <div className="logintile">
            <Logintitle text="Signed Up Successfully" />
          </div>

          <div className="paragraphs">
            <Loginparagraph text="Your account has been created successfully." />
            <br />
            <Loginparagraph text="Please check your email to verify your account." />
            <br />
            <Loginparagraph text="You can now start using Reddit." />
          </div>

          <div className="submits">
            <Submit text="Done" onClick={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
