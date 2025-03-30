"use client";

import type React from "react";

import { useEffect } from "react";
import { Edit, LogOut } from "lucide-react";
import SongRow from "@src/components/SongRow";
import ArtistCard from "@src/components/ArtistCard";
import MobileNav from "@src/components/MobileNav";
import { useSongStore } from "@src/stores/useSongStore";
import { useAuth0 } from "@auth0/auth0-react";
import { useArtistStore } from "@src/stores/useArtistStore";
import useAuthStore from "@src/stores/useAuthStore";
import RequireLoginScreen from "@src/components/RequireLoginScreen";

const Profile: React.FC = () => {
  const { isLoading, isLoggedIn } = useAuthStore();
  const { user, logout } = useAuth0();
  const { getSongs, songs } = useSongStore();
  const { getArtists, artists } = useArtistStore();

  useEffect(() => {
    const loadUserData = async () => {
      await Promise.all([getSongs(), getArtists()]);
    };

    if (!isLoading && isLoggedIn) {
      loadUserData();
    }
  }, [isLoading, isLoggedIn]);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  if (!isLoggedIn) {
    return (
      <RequireLoginScreen
        feature="Profile"
        message="Please login to view your profile"
      />
    );
  }

  return (
    <div className="pb-20 md:pb-0">
      <MobileNav />

      <header className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <img
            src={user?.picture}
            alt={user?.email}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-800"
          />
          <button className="absolute bottom-0 right-0 bg-primary text-black rounded-full p-2">
            <Edit size={16} />
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-1">{user?.nickname}</h1>
        <p className="text-gray-400 mb-4">{user?.email}</p>
      </header>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recently Played</h2>
          <button className="text-sm text-gray-400 hover:text-white">
            See all
          </button>
        </div>
        <div className="space-y-2">
          {songs.map((song) => (
            <SongRow key={song.id} song={song} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Top Artists</h2>
          <button className="text-sm text-gray-400 hover:text-white">
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      <div className="flex justify-center mt-12">
        <button
          className="flex items-center gap-2 text-gray-400 hover:text-white"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
