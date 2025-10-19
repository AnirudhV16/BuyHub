/** @format */

import React from "react";
import "./Loading.css";

const Loading = ({ size = "medium", text = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${size}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
