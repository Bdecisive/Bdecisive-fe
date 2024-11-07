import React from "react";
import { Link } from "react-router-dom";
// import './NavBar.css';

function NavBarFollower() {
    // clickHandler() {
    //     localStorage.clear()
    // }

    return (
        <>
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <Link className="navbar-brand" to="/ViewPostsFollowerHome">
              <img src={require('../logo.jpeg')} width="100" height="50" alt="Logo" />
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
    
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav mr-auto">
    
                <li className="nav-item active">
                  <Link className="nav-link" to="/ViewPostsFollowerHome">Home</Link>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownSearch" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Search
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdownSearch">
                    <li>
                      <Link className="dropdown-item" to="/SearchProductsF">Search Products</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/SearchInfluencersF">Search Influencers</Link>
                    </li>
                  </ul>
                </li>
    
                
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownProfile" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    My Profile
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdownProfile">
                    <li>
                      <Link className="dropdown-item" to="/ManageProfile">Manage Profile</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/FollowingList">Following List</Link>
                    </li>
                  </ul>
                </li>
                
              </ul>
              <ul className="navbar-nav ms-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/Home">
                    <i className="bi bi-box-arrow-right text-white"></i> Logout
                </Link>
                </li>
            </ul>
            </div>
          </nav>
        </>
      );
    }

  
    export default NavBarFollower;

    // <Link className="nav-link" to="/Home" onClick={this.clickHandler}>LogOut</Link>