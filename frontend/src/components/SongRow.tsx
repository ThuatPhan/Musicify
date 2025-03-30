"use client";

import type React from "react";
import { Play, Pause, Heart } from "lucide-react";
import type { Song } from "@src/types/Song";
import usePlayerStore from "@src/stores/usePlayerStore";
import RequireLoginPopup from "./RequireLoginPopup";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

interface SongRowProps {
  song: Song;
}

const SongRow: React.FC<SongRowProps> = ({ song }) => {
  const { isAuthenticated } = useAuth0();
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } =
    usePlayerStore();

  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;
  const [showPopup, setShowPopup] = useState(false);

  const handlePlayClick = (): void => {
    if (!isAuthenticated) {
      setShowPopup(true);
      return;
    }
    if (currentSong?.id === song.id) {
      isPlaying ? pauseSong() : resumeSong();
    } else {
      playSong(song);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {showPopup ? (
        <RequireLoginPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
        />
      ) : (
        <div className="relative grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] gap-4 p-2 rounded-md items-center card-hover">
          <div className="flex items-center justify-center w-8 text-gray-400">
            <button onClick={handlePlayClick}>
              {isCurrentlyPlaying ? (
                <Pause size={16} className="text-primary" />
              ) : (
                <Play size={16} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <img
              src={song.coverImageUrl || "/placeholder.svg"}
              alt={song.name}
              className="w-10 h-10 rounded"
            />
            <div className="truncate">
              <p
                className={`font-medium truncate ${
                  isCurrentlyPlaying ? "text-primary" : ""
                }`}
              >
                {song.name}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {song.artist.name}
              </p>
            </div>
          </div>

          <div className="hidden md:block text-gray-400 text-sm">
            {formatDuration(song.duration)}
          </div>

          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-white">
              <Heart size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SongRow;
