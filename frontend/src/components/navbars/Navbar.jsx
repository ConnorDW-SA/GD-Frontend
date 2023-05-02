import React, { useState, useEffect } from "react";
import { Navbar } from "react-bootstrap";
import NavbarHeader from "./NavbarHeader";
import NavbarLinks from "./NavbarLinks";
import SideMenu from "./SideMenu";

export default function MyNavbar() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (
      sideMenuOpen &&
      !event.target.closest(".side-menu") &&
      !event.target.closest(".side-menu-content")
    ) {
      setSideMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sideMenuOpen]);

  return (
    <Navbar className="navbar p-5">
      <div className="navbar text-white d-flex justify-content-between w-100">
        <NavbarHeader toggleSideMenu={toggleSideMenu} />
        <NavbarLinks />
      </div>
      <SideMenu sideMenuOpen={sideMenuOpen} toggleSideMenu={toggleSideMenu} />
    </Navbar>
  );
}
