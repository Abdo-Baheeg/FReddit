import React from "react";
import "./components.css";

const Continue = ({ text, icon, link }) => {
  const element = (
    <>
      <img src={icon} alt="icon" className="continue-button-icon" />
      <span>{text}</span>
    </>
  );

  // Render as a link when provided, otherwise as a button
  if (link) {
    return (
      <div className="continue-button-container">
        <a href={link} className="continue-button">
          {element}
        </a>
      </div>
    );
  }

  return (
    <div className="continue-button-container">
      <button type="button" className="continue-button">
        {element}
      </button>
    </div>
  );
};

const Input = ({ label, type = "text", required }) => {
  return (
    <div className="input-container">
      <input type={type} className="input-field" placeholder={label} />
      {required && <span className="required-asterisk">*</span>}
    </div>
  );
};

const Submit = ({ text }) => {
  return <button className="login-button">{text}</button>;
};

export { Continue, Input, Submit };
