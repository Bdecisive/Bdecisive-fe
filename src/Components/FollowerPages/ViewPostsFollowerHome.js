import React from "react";
import NavBarFollower from "./NavBarFollower";
import './ViewPostsFollowerHome.css'; // We'll create this CSS file
import Footer from "../Footer";

function ViewPostsFollowerHome() {
  return (
    <>
      <NavBarFollower />

      
      <div className="parallax-section">
        <div className="parallax-content">
          <h1 className="h3">Welcome to BDecisive</h1>
          <p className="p">Scroll down to see more posts</p>
        </div>
      </div>

      <div className="content-section">
        <h3 className="h3">Post 1</h3>
        <h3 className="h3">Post 2</h3>
        <h3 className="h3">Post 3</h3>
      </div>
      <Footer />
    </>
  );
}

export default ViewPostsFollowerHome;
