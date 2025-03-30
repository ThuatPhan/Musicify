import type React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "@src/components/Sidebar";
import Player from "@src/components/Player";
import Home from "@src/pages/Home";
import Search from "@src/pages/Search";
import Library from "@src/pages/Library";
import Profile from "@src/pages/Profile";
import Artist from "@src/pages/Artist";
import AllArtists from "@src/pages/AllArtists";
import AllSongs from "@src/pages/AllSongs";
import Admin from "@src/pages/Admin";
import usePlayerStore from "@src/stores/usePlayerStore";
import { useSyncAuth } from "@src/stores/useAuthStore";
import "./index.css";
import Playing from "@src/pages/Playing";

const App: React.FC = () => {
  const { currentSong } = usePlayerStore();
  useSyncAuth();

  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");
  const isPlayingPage = location.pathname.startsWith("/playing");

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {isAdminPage ? (
        <Admin />
      ) : (
        <>
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/artist/:id" element={<Artist />} />
                <Route path="/all-artists" element={<AllArtists />} />
                <Route path="/all-songs" element={<AllSongs />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/playing/:id" element={<Playing />} />
              </Routes>
            </main>
          </div>
          {!isPlayingPage && currentSong && <Player />}
        </>
      )}
    </div>
  );
};

export default App;
