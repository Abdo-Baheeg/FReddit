import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Chat from "./pages/Chat";
import RedditProfilePage from "./pages/viewprofile.js";
import Setting from "./pages/setting";
import Header from "./components/Header/Header.js";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="App">
          <Header />
          <Sidebar />

          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
              <Route path="/viewprofile" element={<RedditProfilePage />} />
              <Route path="/setting" element={<Setting />} />

              <Route path="*" element={<h2>404: Page Not Found</h2>} />
            </Routes>
          </div>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
