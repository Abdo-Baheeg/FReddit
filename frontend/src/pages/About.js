import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./About.css";

const About = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`about-page ${isDarkMode ? "dark" : ""}`}>
      <div className="about-card">

        {/* Header */}
        <div className="about-header">
          <img
            src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
            alt="FReddit"
          />
          <h1>FReddit</h1>
          <p className="about-subtitle">
            Reddit-inspired social platform
          </p>
        </div>

        {/* Description */}
        <p className="about-desc">
          FReddit is a full-stack Reddit clone built for learning and practicing
          modern web development concepts including real-time communication,
          authentication, and scalable UI design.
        </p>

        {/* Tech Stack */}
        <div className="about-section">
          <h3>Tech Stack</h3>
          <div className="tech-badges">
            <span>React</span>
            <span>Node.js</span>
            <span>Express</span>
            <span>MongoDB</span>
            <span>Socket.io</span>
          </div>
        </div>

        {/* Links */}
        <div className="about-section">
          <h3>Links</h3>
          <div className="about-links">
            <a
              href="https://github.com/Abdo-Baheeg/FReddit"
              target="_blank"
              rel="noreferrer"
            >
              GitHub Repository
            </a>
          </div>
        </div>

       <div className="contributors-section">
  <h3>Contributors</h3>

  <ul className="contributors-list">
    <li>
      <a
        href="https://www.linkedin.com/in/ahmedmo2511"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ahmed Mostafa
      </a>
    </li>

    <li>
      <a
        href="https://www.linkedin.com/in/abdelrahman-m-bahig/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abdo Bahig
      </a>
    </li>

    <li>
      <a
        href="https://www.linkedin.com/in/mohammedosama27/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Mohamed Osama
      </a>

    </li>
    <li>
      <a
        href="https://www.linkedin.com/in/basmala-hany-5667072a5/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Basmala Hany
      </a>
      
    </li><li>
      <a
        href="https://www.linkedin.com/in/rana-tarek18/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Rana Tarek
      </a>
      
    </li><li>
      <a
        href="https://www.linkedin.com/in/mohammedosama27/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Mariam Helal
      </a>
      
    </li>
    
  </ul>
</div>


        {/* Footer */}
        <div className="about-footer">
          <span>Built for Fun </span>
        </div>

      </div>
    </div>
  );
};

export default About;
