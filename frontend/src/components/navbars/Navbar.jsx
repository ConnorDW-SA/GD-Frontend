import React, { useState, useEffect } from "react";
import { Navbar } from "react-bootstrap";

import { useStore } from "../../zustand/store";
import { useNavigate } from "react-router-dom";

export default function MyNavbar() {
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <Navbar>
      <div className="navbar nav">
        <a href="/rules">
          <h5 className="nav navbar-links">Chess Rules</h5>
        </a>
        <a href="/contact">
          <h5 className="nav navbar-links">Contact</h5>
        </a>
        <button className="no-style-navbar-button" onClick={handleLogout}>
          <h5 className="nav navbar-links">Logout</h5>
        </button>
      </div>
    </Navbar>
  );
}
