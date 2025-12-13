import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-animation">
          
          <div className="error-code">
            <span className="digit bounce-1">4</span>
            <span className="digit bounce-2">0</span>
            <span className="digit bounce-3">4</span>
          </div>
        </div>

        <h1 className="notfound-title">Page Not Found</h1>
        
        <p className="notfound-message">
          Oops! The page you're looking for seems to have wandered off into the void.
          <br />
          Even our FReddit alien couldn't find it!
        </p>



        <div className="notfound-actions">
          <button className="home-button" onClick={handleGoHome}>
            <span className="button-icon">🏠</span>
            <span>Return to Home</span>
          </button>
          
          <div className="auto-redirect">
            Auto-redirecting in <span className="countdown">{countdown}</span> seconds...
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
