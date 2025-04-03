import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Closets from "./Pages/Closets";
import Post from "./Pages/Post";
import Profile from "./Pages/Profile";
import "./App.css"
import IndividualCloset from "./Pages/IndividualCloset";

function App() {
  return (
    <Router basename="/ensemble-hci">
      <div className="app-container">
        <div className="content">
          <Routes>
            <Route path="/" element={<Closets />} />
            <Route path="/post" element={<Post />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/closet/:name" element={<IndividualCloset />} />
          </Routes>
        </div>

        <Navbar className="navbar" fixed="bottom" variant="light">
          <Nav className="w-100 d-flex justify-content-around">
            <Nav.Link as={Link} to="/">Closets</Nav.Link>
            <Nav.Link as={Link} to="/post">Post</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    </Router>
  );
}

export default App;
