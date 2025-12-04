import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Chat from "./pages/Chat";
import RedditProfilePage from "./pages/viewprofile.js";
import AI_Summary from "./components/AI-summary";
import Setting from "./pages/setting";
import Header from "./components/Header/Header.js";

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="App">
          <Navbar />
          
          <div className="container">
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
              {/* Remove or comment out SettingsPage route until it exists */}
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
              <Route path="*" element={<h2>404: Page Not Found</h2>} />
            </Routes>
          </div>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;