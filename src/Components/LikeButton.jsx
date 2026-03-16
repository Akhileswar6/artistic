import { useState } from "react";
import "./LikeButton.css";

const LikeButton = () => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="heart-container" title={liked ? "Unlike" : "Like"}>
      <input
        type="checkbox"
        className="checkbox"
        checked={liked}
        onChange={() => setLiked(!liked)}
      />

      <div className="svg-container">
        {/* Outline */}
        <svg viewBox="0 0 24 24" className="svg-outline">
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
        </svg>

        {/* Filled */}
        <svg viewBox="0 0 24 24" className="svg-filled">
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
        </svg>

        {/* Celebration */}
        <svg className="svg-celebrate" width="100" height="100">
          <polygon points="10,10 20,20" />
          <polygon points="10,50 20,50" />
          <polygon points="20,80 30,70" />
          <polygon points="90,10 80,20" />
          <polygon points="90,50 80,50" />
          <polygon points="80,80 70,70" />
        </svg>
      </div>
    </div>
  );
};

export default LikeButton;
