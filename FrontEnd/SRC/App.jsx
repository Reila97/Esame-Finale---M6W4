import "./App.css";
import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";

import MyNav from "./COMPONENTS/Navbar/Navbar.jsx";
import Welcome from "./COMPONENTS/Welcome/Welcome.jsx";
import AllPost from "./COMPONENTS/BlogPost/AllPost.jsx";
import AllAuthors from "./COMPONENTS/Author/AllAuthors.jsx";
import Login from "./COMPONENTS/Login/Login.jsx";
import AuthorProfile from "./COMPONENTS/Author/AuthorProfile.jsx";
import UpdateAuthor from "./COMPONENTS/Author/UpdateAuthor.jsx";
import UpdateBlogPost from "./COMPONENTS/BlogPost/UpdateBlogPost.jsx";
import UpdateComment from "./COMPONENTS/Comment/UpdateComment.jsx";
import NewBlogPost from "./COMPONENTS/BlogPost/NewBlogPost.jsx";


function App() {
  return (
    <>
      <MyNav />
      <Container className="py-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/posts" element={<AllPost />} />
          <Route path="/authors" element={<AllAuthors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<AuthorProfile />} />

          {/* ROTTE UPDATE */}
          <Route path="edit-author/:id" element={<UpdateAuthor />} />
          <Route path="/edit-post/:id" element={<UpdateBlogPost />} />
          <Route
            path="/edit-comment/:postId/:commentId"
            element={<UpdateComment />}
          />

          <Route path="/new-post" element={<NewBlogPost />} />

          {/* Rotta di fallback per 404 (Opzionale) */}
          <Route
            path="*"
            element={
              <div className="text-center mt-5">404 - Pagina non trovata</div>
            }
          />
        </Routes>
      </Container>
    </>
  );
}
export default App;
