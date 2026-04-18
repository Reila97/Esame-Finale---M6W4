import "./App.css";
import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router";
import { Container } from "react-bootstrap";

import MyNav from "./COMPONENTS/Navbar/Navbar.jsx"
import Welcome from "./COMPONENTS/Welcome/Welcome";
import AllPost from "./COMPONENTS/BlogPost/AllPost.jsx"
import AllAuthors from "./COMPONENTS/Author/AllAuthors.jsx"
import Login from "./COMPONENTS/Login/Login.jsx"
import AuthorProfile from "./COMPONENTS/AuthorProfile/AuthorProfile.jsx"





function App() {
  return (
    <>
      <MyNav />
      <Container className="py-4">
        <Routes>
          <Route path="/" element={<Welcome/>} />
          <Route path="/posts" element={<AllPost />} />
          <Route path="/authors" element={<AllAuthors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<AuthorProfile />} />
        </Routes>
      </Container>
    </>
  );
}
export default App;
