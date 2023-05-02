import React from "react";
import { useStore } from "../../zustand/store";
import { useNavigate } from "react-router-dom";
const NavbarLinks = () => {
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(navigate);
  };
  return (
    <div className="d-flex w-25 justify-content-between mr-3">
      <a href="#">
        <h5 className="nav pt-1 navbar-links">Chess Rules</h5>
      </a>
      <a href="#">
        <h5 className="nav pt-1 navbar-links">Contact</h5>
      </a>
      <button className="no-style-navbar-button" onClick={handleLogout}>
        <h5 className="nav pt-1 navbar-links">Logout</h5>
      </button>
    </div>
  );
};

export default NavbarLinks;
