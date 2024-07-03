import React from "react";

export default function Header(props) {
  return (
    <div className="header">
      <span className="header-left">Snake Game</span>
      <div className="header-right">
        Score: <span className="score">{props.score}</span>
      </div>
    </div>
  );
}
