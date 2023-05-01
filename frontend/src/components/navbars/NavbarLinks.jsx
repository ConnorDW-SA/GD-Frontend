import React from "react";

const NavbarLinks = () => {
  return (
    <div className="d-flex w-50 justify-content-between mr-3">
      <a href="/main">
        <h5 className="nav pt-1 navbar-links">Home</h5>
      </a>
      <a href="#">
        <h5 className="nav pt-1 navbar-links">Chess Rules</h5>
      </a>
      <a href="#">
        <h5 className="nav pt-1 navbar-links">Contact</h5>
      </a>
      <button className="no-style-navbar-button">
        <h5 className="nav pt-1 navbar-links">Logout</h5>
      </button>
    </div>
  );
};

export default NavbarLinks;
