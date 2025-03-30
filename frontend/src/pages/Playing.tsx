"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useSongStore } from "@src/stores/useSongStore";
import { useParams, useNavigate } from "react-router-dom";
import usePlayerStore from "@src/stores/usePlayerStore";
import { NotificationType } from "@src/types/Enums";
import ErrorCard from "@src/components/ErrorCard";
import AppError from "@src/utils/AppError";
import Player from "@src/components/Player";
import { ChevronLeft, Music } from "lucide-react";

const Playing: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { song, lyric, loading, notification, getSong } = useSongStore();
  const { currentTime, currentSong, playSong, resumeSong, setCurrentTime } =
    usePlayerStore();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const lyricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [contentLoaded, setContentLoaded] = useState(false);

  // Fetch song if ID is in URL
  useEffect(() => {
    if (id) {
      getSong(id);
    }
  }, [id, getSong]);

  // Play song when loaded
  useEffect(() => {
    if (song) {
      playSong(song);
      // Add a small delay before showing content for smoother animation
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [song, playSong]);

  // Find index of current lyric
  const activeLyricIndex =
    lyric?.lyrics?.findIndex(
      (line, i) =>
        line.timestamp <= currentTime &&
        (lyric.lyrics[i + 1]?.timestamp > currentTime ||
          i === lyric.lyrics.length - 1)
    ) ?? -1;

  // Auto scroll to active lyric
  useEffect(() => {
    if (activeLyricIndex !== -1 && lyricRefs.current[activeLyricIndex]) {
      lyricRefs.current[activeLyricIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLyricIndex]);

  // Jump to timestamp when clicking on a lyric
  const handleLyricClick = (timestamp: number) => {
    setCurrentTime(timestamp);
    resumeSong(); // Continue playing if paused
  };

  // Format time from seconds to MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {notification && notification.type === NotificationType.ERROR && (
        <ErrorCard error={new AppError(notification.message)} />
      )}

      <div className="pb-20 md:pb-0">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors duration-200"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>

        <main className="flex-1 container mx-auto p-4 md:p-6 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Song info */}
          <div className="md:col-span-1">
            {loading ? (
              <div className="bg-gray-900 p-6 rounded-lg animate-pulse">
                <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-8 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              </div>
            ) : song ? (
              <div
                className={`bg-gray-900 p-6 rounded-lg transition-all duration-500 ${
                  contentLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <div className="relative aspect-square mb-4">
                  <img
                    src={song.coverImageUrl}
                    alt={song.name}
                    className="w-full rounded-lg border border-gray-700 object-cover"
                    onLoad={() => setContentLoaded(true)}
                  />
                </div>
                <h2 className="text-2xl font-bold truncate mt-4">
                  {song.name}
                </h2>
                <p className="text-gray-400">
                  {song.artist.name}
                </p>
              </div>
            ) : null}
          </div>

          {/* Lyrics display */}
          <div className="md:col-span-2">
            {loading ? (
              <div className="bg-gray-900 p-6 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-800 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-800 rounded"
                      style={{
                        width: `${Math.floor(Math.random() * 40) + 60}%`,
                        opacity: 1 - i * 0.08,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`bg-gray-900 p-6 rounded-lg transition-all duration-500 ${
                  contentLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Lyrics</h2>
                <div
                  ref={lyricsContainerRef}
                  className="h-[400px] overflow-y-auto pr-4 py-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                >
                  {lyric && lyric.lyrics.length > 0 ? (
                    <div className="py-16">
                      {lyric.lyrics.map((line, index) => (
                        <div
                          key={index}
                          ref={(el) => (lyricRefs.current[index] = el)}
                          className={`py-2 cursor-pointer group transition-all duration-300 ease-in-out relative ${
                            index === activeLyricIndex
                              ? "text-primary text-xl font-medium"
                              : "text-gray-400 hover:text-gray-200"
                          }`}
                          onClick={() => handleLyricClick(line.timestamp)}
                        >
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-12 opacity-0 group-hover:opacity-100 transition-opacity">
                              {formatTime(line.timestamp)}
                            </span>
                            <span className="ml-2">{line.content}</span>
                          </div>

                          {index === activeLyricIndex && (
                            <div className="absolute left-0 w-1 h-full bg-primary rounded-full -ml-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Music size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No lyrics available for this song.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {currentSong && (
        <div className="fixed bottom-0 left-64 right-0">
          <Player />
        </div>
      )}
    </>
  );
};

export default Playing;
