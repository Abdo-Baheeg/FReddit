import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import {
  CreateCommunityProvider,
  useCreateCommunity,
} from "./context/CreateCommunityContext";
import Home from "./pages/Home";
import AllCommunities from "./pages/allCommunities";
import Popular from "./pages/Popular";
import Explore from "./pages/Explore";
import All from "./pages/All";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Chat from "./pages/Chat";
import RedditProfilePage from "./pages/viewprofile.js";
import Setting from "./pages/setting";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import Drafts from "./pages/Drafts";
import Achievements from "./pages/Achievements";
import Premium from "./pages/Premium";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SidebBar";
import CreateCommunityModal from "./components/createCommunity";
import CommunityPage from "./pages/communityPage";
import About from "./pages/About";
import Advertise from "./pages/Advertise";
import Help from "./pages/Help";

function AppContent() {
  const { isCreateCommunityModalOpen, closeCreateCommunityModal } =
    useCreateCommunity();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const handleCommunityCreated = (community) => {
    console.log("Community created:", community);
    closeCreateCommunityModal();
    // Optionally navigate to the new community page
    // window.location.href = `/r/${community.name}`;
  };

  return (
    <div className="App">
      <Navbar />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div
        className={`main-content ${
          isSidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/all" element={<All />} />
          <Route path="/communities" element={<AllCommunities />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/create-submit" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:conversationId" element={<Chat />} />
          <Route path="/viewprofile" element={<RedditProfilePage />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/search" element={<Search />} />
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/community/:communityId" element={<CommunityPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/advertise" element={<Advertise />} />\
          <Route path="/help" element={<Help />} />

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
