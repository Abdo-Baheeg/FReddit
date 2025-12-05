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

const ContinueWith = ({ text, icon, link }) => {
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

// const InputText = ({ label, type = "text", required }) => {
//   const [value, setValue] = useState("");
//   const [focused, setFocused] = useState(false);

//   return (
//     <div
//       className={`input-container ${focused ? "focused" : ""} ${
//         value ? "filled" : ""
//       }`}
//     >
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         onFocus={() => setFocused(true)}
//         onBlur={() => setFocused(false)}
//         className="input-field"
//       />

//       <label className="input-label">
//         {label} {required && <RequiredAsterisk />}
//       </label>
//     </div>
//   );
// };

const InputText = ({ label, type = "text", required, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`input-container`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="input-field"
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

const BackButton = ({ target }) => {
  return (
    <button
      className="back-btn"
      onClick={() => (window.location.href = target)}
    >
      ←
    </button>
  );
};

export {
  Logintitle,
  Loginparagraph,
  Loginlink,
  ContinueWith,
  OR,
  InputText,
  Submit,
  CloseButton,
  BackButton,
  LoginMover,
};
