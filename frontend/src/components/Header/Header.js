import React, { useState } from "react";
import Menu from "./Menu/Menu.js";
import Login from "../../pages/InHeader/Login/Login.js";
import Signup from "../../pages/InHeader/Login/Signup.js";
import Reset from "../../pages/InHeader/Login/Reset.js";
import "./Header.css";

const Logo = () => {
  return (
    <div className="Header-logo">
      <div className="logo-circle">
        <img src="/icons/reddit-logo.svg" alt="Reddit Logo" />
      </div>
      <div className="logo-text">
        <img src="/icons/reddit-text.svg" alt="Reddit Text" />
      </div>
    </div>
  );
};

const SearchBar = () => {
  return (
    <div id="Header-searchbar">
      <input type="search" placeholder="Search Reddit" />
    </div>
  );
};

const Icons = () => {
  const [activeModal, setActiveModal] = useState(null); // null, 'login', 'signup', 'reset'

  const handleShowLogin = () => setActiveModal("login");
  const handleShowSignup = () => setActiveModal("signup");
  const handleShowReset = () => setActiveModal("reset");
  const handleCloseAll = () => setActiveModal(null);

  // Array of menu items
  const menuItems = [
    { text: "Log In / Sign Up", onClick: handleShowLogin },
    { text: "Advertise", onClick: () => alert("Advertise popup!") },
    { text: "Try Reddit Pro", onClick: () => alert("Reddit Pro popup!") },
  ];

  // Optional icons for each menu item
  const icons = ["/icons/login.svg", "/icons/login.svg", "/icons/login.svg"];

  return (
    <div>
      <div id="Header-icons">
        <div id="get-app-all">
          <button id="get-app-btn">
            Get App
            <span className="menu-icon-wrapper">
              <img
                src="/icons/get-app.svg"
                alt="Get App"
                className="menu-icon"
              />
            </span>
          </button>
        </div>
        <button id="login-button" onClick={handleShowLogin}>
          Log In
        </button>
      </div>
      <div id="Header-menu">
        <Menu items={menuItems} iconSrc={icons} />
      </div>
      <Login
        isOpen={activeModal === "login"}
        onClose={handleCloseAll}
        onShowSignup={handleShowSignup}
        onShowReset={handleShowReset}
      />
      <Signup
        isOpen={activeModal === "signup"}
        onClose={handleCloseAll}
        onShowLogin={handleShowLogin}
      />
      <Reset
        isOpen={activeModal === "reset"}
        onClose={handleCloseAll}
        onShowLogin={handleShowLogin}
      />
    </div>
  );
};

function Header() {
  return (
    <div id="Header-container">
      <Logo />
      <SearchBar />
      <Icons />
    </div>
  );
}

export default Header;
