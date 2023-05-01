import React from "react";

const SideMenu = ({ sideMenuOpen, toggleSideMenu }) => {
  return (
    <div className={`side-menu-content pb-5 ${sideMenuOpen ? "show" : ""}`}>
      <a className="side-menu-link" href="/newgame">
        New Game
      </a>
      <a className="side-menu-link" href="/currentgames">
        Current Games
      </a>
      <a className="side-menu-link" href="/profile">
        Profile
      </a>
    </div>
  );
};

export default SideMenu;
