import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const NavbarHeader = ({ toggleSideMenu }) => {
  return (
    <div className="d-flex">
      <div className="side-menu mr-4" onClick={toggleSideMenu}>
        <a className="onclick-side">
          <FontAwesomeIcon icon={faBars} />
        </a>
      </div>
      <a href="/main">
        <h3 className="nav nav-logo">Grandmaster's Den.</h3>
      </a>
    </div>
  );
};

export default NavbarHeader;
