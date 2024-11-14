import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./logo.png";
import "./Navbar.css";
import { useAuth } from "../../Context/useAuth";

interface Props {}

const Navbar = (props: Props) => {
  const { isLoggedIn, user, logout, sideMenuIsExpand } = useAuth();

  console.log(sideMenuIsExpand)
  return (
    <>
    <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sideMenuIsExpand ? "md:ml-72" : "md:ml-20"
          }`}>
      <nav className="relative container mx-auto p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-20">
            <Link to="/">
              <img className="logo" src={logo} alt="" />
            </Link>
            <div className="hidden font-bold lg:flex">
              <Link to="/search" className="text-black hover:text-darkBlue">
                Search
              </Link>
            </div>
          </div>
          {isLoggedIn() ? (
            <div className="hidden lg:flex items-center space-x-6 text-back">
              <div className="hover:text-darkBlue">Welcome, {user?.userName}</div>
              <a
                onClick={logout}
                className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70"
              >
                Logout
              </a>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-6 text-back">
              <Link to="/login" className="hover:text-darkBlue">
                Login
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
    </>
  );
};

export default Navbar;
