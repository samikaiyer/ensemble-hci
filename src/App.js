import React from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Closets from "./Pages/Closets";
import Post from "./Pages/Post";
import Profile from "./Pages/Profile";
import IndividualCloset from "./Pages/IndividualCloset";
import Login from "./Pages/Login";

import "./App.css";

import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <div className="app-container">
      <div className="content">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Closets /></PrivateRoute>} />
        <Route path="/post" element={<PrivateRoute><Post /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/closet/:name" element={<PrivateRoute><IndividualCloset /></PrivateRoute>} />
      </Routes>
      </div>

      {!hideNavbar && (
        <Navbar className="navbar" fixed="bottom" variant="light">
          <Nav className="w-100 d-flex justify-content-around">
            <Nav.Link as={Link} to="/">Closets</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          </Nav>
        </Navbar>
      )}
    </div>
  );
}

export default App;
