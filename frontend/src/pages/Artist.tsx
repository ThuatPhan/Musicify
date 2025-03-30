"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause, Heart, Music } from "lucide-react";
import MobileNav from "@src/components/MobileNav";
import SongRow from "@src/components/SongRow";
import { useArtistStore } from "@src/stores/useArtistStore";
import { useSongStore } from "@src/stores/useSongStore";
import usePlayerStore from "@src/stores/usePlayerStore";
import SkeletonSongRow from "@src/components/SkeletonSongRow";
import ErrorCard from "@src/components/ErrorCard";
import useAuthStore from "@src/stores/useAuthStore";
import RequireLoginPopup from "@src/components/RequireLoginPopup";
import { NotificationType } from "@src/types/Enums";
import AppError from "@src/utils/AppError";

const Artist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    getArtist,
    artist,
    loading: artistLoading,
    notification: artistNotification,
  } = useArtistStore();
  const {
    getSongsOfArtist,
    songs,
    loading: songsLoading,
    notification: songNotification,
  } = useSongStore();
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayerStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const isLoading = artistLoading || songsLoading;
  const notification = artistNotification || songNotification;
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const loadArtistData = async () => {
      if (!id) return;
      await Promise.all([getArtist(id), getSongsOfArtist(id)]);
    };

    loadArtistData();
  }, [id]);

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    if (!isLoggedIn) {
      setShowPopup(true);
      return;
    }
    if (
      isPlaying &&
      currentSong &&
      songs.some((song) => song.id === currentSong.id)
    ) {
      pauseSong();
    } else {
      playSong(songs[0]);
    }
  };

  // Generate skeleton arrays for loading state
  const skeletonCount = 5;
  const skeletonArray = Array(skeletonCount).fill(null);

  if (notification && notification.type === NotificationType.ERROR) {
    return <ErrorCard error={new AppError(notification.message)} />;
  }

  return (
    <div className="pb-20 md:pb-0">
      <MobileNav />
      {showPopup && (
        <RequireLoginPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
        />
      )}
      {isLoading ? (
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
            <div className="w-48 h-48 bg-gray-700 rounded-full"></div>
            <div className="w-full">
              <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
            <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
          </div>

          <div className="h-8 bg-gray-700 rounded w-32 mb-4"></div>

          {skeletonArray.map((_, index) => (
            <SkeletonSongRow key={`skeleton-${index}`} />
          ))}
        </div>
      ) : artist ? (
        <>
          <header className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
            <img
              src={artist.avatar || "/placeholder.svg"}
              alt={artist.name}
              className="w-48 h-48 rounded-full object-cover shadow-lg"
            />
            <div>
              <p className="text-sm uppercase font-semibold">Artist</p>
              <h1 className="text-5xl font-bold mb-4">{artist.name}</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">{songs.length} songs</span>
              </div>
            </div>
          </header>

          <div className="mb-6 flex items-center gap-4">
            <button
              className="bg-primary hover:bg-primary-hover text-black rounded-full p-3 shadow-lg"
              onClick={handlePlayAll}
              disabled={songs.length === 0}
            >
              {isPlaying &&
              currentSong &&
              songs.some((song) => song.id === currentSong.id) ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
            </button>
            <button className="text-gray-400 hover:text-white">
              <Heart size={24} />
            </button>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Songs</h2>

            {songs.length > 0 ? (
              <div className="space-y-2">
                {songs.map((song) => (
                  <SongRow key={song.id} song={song} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Music size={48} className="mb-4 opacity-50" />
                <p>No songs available for this artist</p>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Artist not found</p>
        </div>
      )}
    </div>
  );
};

export default Artist;
