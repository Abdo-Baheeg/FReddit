import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {
  Logintitle,
  Loginparagraph,
  InputText,
  Submit,
  BackButton,
} from "./components.js";
import { userApi } from "../../api";


const SignupP2 = ({ setOpen, email, onSignupSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Both are Empty → disabled
  const disabled = username.trim() === "" || password.trim() === "";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSignup = async () => {
    if (disabled) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await userApi.register(username, email, password);
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      setOpen(false);
      // notify parent to close other windows (signup/login)
      onSignupSuccess && onSignupSuccess();
    } catch (err) {
      // If backend indicates username already exists, show the required text
      const msg =
        err.response?.data?.message || "Signup failed. Please try again.";
      if (
        /user(name)?\s.*exist|already/i.test(msg) ||
        err.response?.status === 409
      ) {
        setError("Username is already exist");
      } else {
        setError("Signup failed. Please try again.");
      }
      console.error("Signup error:", err);
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

  return (
    <div className="login-container">
      <div className="login-overlay" onClick={() => setOpen(false)}>
        <div className="login-notclose" onClick={(e) => e.stopPropagation()}>
          <div className="my-window-back-button">
            <BackButton onClose={() => setOpen(false)} />
          </div>

          <div className="logintile">
            <Logintitle text="Create Username and Password" />
          </div>

          <div className="paragraphs">
            <Loginparagraph text="Reddit is anonymous, so your username is what you'll go" />
            <br></br>
            <Loginparagraph text="by here. Choose wisely-beacause once you get a name," />
            <br></br>
            <Loginparagraph text={"you can't change it."} />
          </div>

          <div className="inputs">
            <InputText
              label="Username"
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

          <div className="submits">
            <Submit
              text={isLoading ? "Signing Up..." : "Sign Up"}
              disabled={disabled || isLoading}
              onClick={handleSignup}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupP2;
