import type React from "react";
import { Play, Pause } from "lucide-react";
import type { Song } from "@src/types/Song";
import usePlayerStore from "@src/stores/usePlayerStore";
import useAuthStore from "@src/stores/useAuthStore";
import RequireLoginPopup from "@src/components/RequireLoginPopup";
import { useState } from "react";

interface SongCardProps {
  song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const { isLoggedIn } = useAuthStore();
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } =
    usePlayerStore();

  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;
  const [showPopup, setShowPopup] = useState(false);

  const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (isLoggedIn) {
      if (isCurrentlyPlaying) {
        pauseSong();
      } else if (currentSong?.id === song.id) {
        resumeSong();
      } else {
        playSong(song);
      }
    } else {
      setShowPopup(true);
    }
  };

  return (
    <>
      {showPopup && (
        <RequireLoginPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
        />
      )}
      <div
        className="bg-surface p-4 rounded-md card-hover transition-all cursor-pointer group relative"
        onClick={() => (isLoggedIn ? playSong(song) : () => setShowPopup(true))}
      >
        <div className="relative mb-4">
          <img
            src={song.coverImageUrl}
            alt={song.name}
            className="w-full aspect-square object-cover rounded-md shadow-lg"
          />
          <button
            className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105 transform transition"
            onClick={handlePlayClick}
          >
            {isCurrentlyPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
        <h3 className="font-semibold truncate">{song.name}</h3>
        <p className="text-gray-400 text-sm truncate">
          {song.artist ? song.artist.name : "Undefined"}
        </p>
      </div>
    </>
  );
};

export default SongCard;
