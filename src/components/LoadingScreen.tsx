import React from "react";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Загрузка...",
}) => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* <div className="loading-logo">
          <span className="loading-logo-text">W</span>
          <span className="loading-logo-accent">.</span>
        </div> */}

        <div className="loading-spinner-wrapper">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        </div>

        <p className="loading-message">{message}</p>

        {/* <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div> */}
      </div>
    </div>
  );
};

export default LoadingScreen;
