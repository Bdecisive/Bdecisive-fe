import React from "react";
import { Link } from "react-router-dom";
// import './NavBar.css';

function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Link className="navbar-brand" to="/">
          <img src={require('./logo.jpeg')} width="100" height="50" alt="Logo" />
        </Link>
        
        {/* Navbar toggler for mobile view */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item-active">
              <Link className="nav-link" to="/Login">Login</Link>
            </li>
            <li className="nav-item-active">
              <Link className="nav-link" to="/SignUp">SignUp</Link>
            </li>
            
            <li className="nav-item active">
              <Link className="nav-link" to="/Contact">Contact us</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
