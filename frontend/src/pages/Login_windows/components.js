import React, { useState } from "react";
import "./components.css";

const Logintitle = ({ text }) => {
  return <h2 className="login-title">{text}</h2>;
};

const Loginparagraph = ({ text }) => {
  return <p className="login-paragraph">{text}</p>;
};

const Loginlink = ({ href, data }) => {
  return (
    <a href={href} className="login-link">
      <p className="login-link-text">{data}</p>
    </a>
  );
};

const LoginMover = ({ data, onOpen }) => {
  return (
    <button
      className="login-link"
      onClick={onOpen}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        font: "inherit",
      }}
    >
      <span className="login-link-text">{data}</span>
    </button>
  );
};

const ContinueWithLink = ({ text, icon, link }) => {
  return (
    <div className="continue-with-container-rounded">
      <a href={link} className="continue-with-container-inner">
        <div className="continue-with-icon">
          <img src={icon} alt="icon" className="continue-with-icon-handler" />
        </div>
        <div className="continue-with-text">
          <span>{text}</span>
        </div>
      </a>
    </div>
  );
};

const ContinueWithWindow = ({ text, icon, onOpen }) => {
  return (
    <button className="continue-with-container-rounded" onClick={onOpen}>
      <div className="continue-with-container-inner">
        <div className="continue-with-icon">
          <img src={icon} alt="icon" className="continue-with-icon-handler" />
        </div>
        <div className="continue-with-text">
          <span>{text}</span>
        </div>
      </div>
    </button>
  );
};

const OR = () => {
  return (
    <>
      <hr className="line" />
      <span className="or-text">OR</span>
      <hr className="line" />
    </>
  );
};

const RequiredAsterisk = () => <span style={{ color: "red" }}> *</span>;

const InputText = ({ label, type = "text", required, onChange }) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (value === "") {
      setIsFocused(false);
    } else {
      // لو فيه value → label يفضل فوق
      // لكن الإطار الأزرق هيختفي من CSS
      setIsFocused(false);
    }
  };

  return (
    <div
      className={`input-container ${value !== "" ? "filled" : ""} ${
        isFocused ? "focused" : ""
      }`}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange && onChange(e);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`input-field ${isFocused ? "input-focused" : ""}`}
      />

      <label className="input-label">
        {label} {required && <RequiredAsterisk />}
      </label>
    </div>
  );
};

const Submit = ({ text, disabled }) => {
  return (
    <button
      className={`login-submit ${disabled ? "disabled" : "active"}`}
      disabled={disabled}
    >
      <span className="submit-text">{text}</span>
    </button>
  );
};

const CloseButton = ({ onClose }) => {
  return (
    <button className="close-btn" onClick={onClose}>
      ×
    </button>
  );
};

const BackButton = ({ onClose }) => {
  return (
    <button className="back-btn" onClick={onClose}>
      ←
    </button>
  );
};

export {
  Logintitle,
  Loginparagraph,
  Loginlink,
  ContinueWithLink,
  ContinueWithWindow,
  OR,
  InputText,
  Submit,
  CloseButton,
  BackButton,
  LoginMover,
};
