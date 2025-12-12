import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";

import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Chat from "./pages/Chat";
import RedditProfilePage from "./pages/viewprofile.js";
import Setting from "./pages/setting";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SidebBar";

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Sidebar />
            <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
 
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
              <Route path="/viewprofile" element={<RedditProfilePage />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
