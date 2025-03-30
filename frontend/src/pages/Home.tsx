"use client";

import type React from "react";

import { useEffect, useState } from "react";
import SongCard from "@src/components/SongCard";
import ArtistCard from "@src/components/ArtistCard";
import MobileNav from "@src/components/MobileNav";
import { useSongStore } from "@src/stores/useSongStore";
import { useArtistStore } from "@src/stores/useArtistStore";
import SkeletonSongCard from "@src/components/SkeletonSongCard";
import SkeletonArtistCard from "@src/components/SkeletonArtistCard";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { getSongs, songs } = useSongStore();
  const { getArtists, artists } = useArtistStore();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getArtists(), getSongs()]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "Good morning 🌅";
      if (hour >= 12 && hour < 17) return "Good afternoon ☀️";
      if (hour >= 17 && hour < 21) return "Good evening 🌆";
      return "Good night 🌙";
    };
    setGreeting(getGreeting());
  }, []);

  const handleSectionClick = (path: string) => navigate(path);

  // Generate skeleton arrays
  const skeletonCount = 5;
  const skeletonArray = Array(skeletonCount).fill(null);

  return (
    <div className="pb-20 md:pb-0">
      <MobileNav />

      <header className="mb-8">
        <h1 className="text-3xl font-bold">{greeting}</h1>
      </header>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Songs</h2>
          <button
            className="text-sm text-gray-400 hover:text-white"
            onClick={() => handleSectionClick(`/all-songs`)}
            style={{ cursor: "pointer" }}
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading
            ? skeletonArray.map((_, index) => (
                <SkeletonSongCard key={`song-skeleton-${index}`} />
              ))
            : songs.map((song) => <SongCard key={song.id} song={song} />)}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Artists</h2>
          <button
            className="text-sm text-gray-400 hover:text-white"
            onClick={() => handleSectionClick(`/all-artists`)}
            style={{ cursor: "pointer" }}
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading
            ? skeletonArray.map((_, index) => (
                <SkeletonArtistCard key={`artist-skeleton-${index}`} />
              ))
            : artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
