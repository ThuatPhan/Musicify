"use client";

import React, { useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
} from "lucide-react";
import usePlayerStore from "@src/stores/usePlayerStore";
import { useNavigate } from "react-router-dom";

const Player: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    playSong,
    pauseSong,
    resumeSong,
    setCurrentTime,
    setVolume,
    volume,
  } = usePlayerStore();

  useEffect(() => {
    if (currentSong) {
      playSong(currentSong);
    }
  }, [currentSong, playSong]);

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <div
      className="bg-gray-900 border-t border-gray-800 p-3 md:p-4 w-full"
      onClick={() => navigate(`/playing/${currentSong.id}`)}
    >
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Song info */}
        <div className="flex items-center gap-3 w-full md:w-1/4">
          <img
            src={currentSong.coverImageUrl || "/placeholder.svg"}
            alt={currentSong.name}
            className="w-12 h-12 rounded"
          />
          <div className="truncate">
            <p className="font-medium truncate">{currentSong.name}</p>
            <p className="text-sm text-gray-400 truncate">
              {currentSong.artist.name}
            </p>
          </div>
        </div>

        {/* Player controls */}
        <div className="flex flex-col items-center w-full md:w-2/4">
          <div className="flex items-center gap-4 mb-2">
            <button className="text-gray-400 hover:text-white">
              <Shuffle size={18} />
            </button>
            <button className="text-gray-400 hover:text-white">
              <SkipBack size={22} />
            </button>
            <button
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
              onClick={() => (isPlaying ? pauseSong() : resumeSong())}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className="text-gray-400 hover:text-white">
              <SkipForward size={22} />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Repeat size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #1db954 ${
                  (currentTime / duration) * 100
                }%, #4d4d4d ${(currentTime / duration) * 100}%)`,
              }}
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 w-full md:w-1/4 justify-end">
          <Volume2 size={18} className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1db954 ${volume}%, #4d4d4d ${volume}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
