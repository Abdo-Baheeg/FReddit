import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import CommunitiesPage from "./pages/allCommunities";
import Chat from "./pages/Chat";
import RedditProfilePage from "./pages/viewprofile.js";
import Setting from "./pages/setting";
import Trylogin from "./pages/Login_windows/Try.js";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SidebBar";

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Sidebar />
          <Trylogin />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} /> */}
              <Route path="/communities" element={<CommunitiesPage />} />
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
