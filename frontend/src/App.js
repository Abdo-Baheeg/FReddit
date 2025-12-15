import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CreateCommunityProvider, useCreateCommunity } from "./context/CreateCommunityContext";
import Home from "./pages/Home";

import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Chat from "./pages/Chat";
import RedditProfilePage from "./pages/viewprofile.js";
import Setting from "./pages/setting";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SidebBar";
import CreateCommunityModal from "./components/createCommunity";

function AppContent() {
  const { isCreateCommunityModalOpen, closeCreateCommunityModal } = useCreateCommunity();

  const handleCommunityCreated = (community) => {
    console.log('Community created:', community);
    closeCreateCommunityModal();
    // Optionally navigate to the new community page
    // window.location.href = `/r/${community.name}`;
  };

  return (
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
      
      {/* Global Create Community Modal */}
      <CreateCommunityModal
        isOpen={isCreateCommunityModalOpen}
        onClose={closeCreateCommunityModal}
        onCreated={handleCommunityCreated}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <CreateCommunityProvider>
          <Router>
            <AppContent />
          </Router>
        </CreateCommunityProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
