import React from "react";
import './NavBar.css';
import {Link} from "react-router-dom"

function Navbar() {
  return (
<>
<nav className="main-nav">
<div className="Menu">
  <ul>
  <Link to="/"><img src={require('./logo.jpeg')} className="img"/></Link>
    <li><Link to="/Contact">Puka</Link></li>
    <li><Link to="/Login">Login </Link></li>
    <li><Link to="/" >Home</Link></li> 
  </ul>
</div>



</nav>

</>
  );
}

export default Navbar