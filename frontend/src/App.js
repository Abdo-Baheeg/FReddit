import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import CommunitiesPage from "./pages/allCommunities";
import Chat from "./pages/Chat";
import RedditChatUI from "./pages/ChatUI.js";
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
          <Routes>
            {/* Chat UI - Full screen without navbar/sidebar */}
            <Route path="/chat-ui" element={<RedditChatUI />} />
            
            {/* Regular routes with navbar/sidebar */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Sidebar />
                <Trylogin />
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
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
              </>
            } />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
