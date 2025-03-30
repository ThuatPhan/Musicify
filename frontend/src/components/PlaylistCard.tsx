import type React from "react";
import { Play, Pause } from "lucide-react";
import type { Playlist } from "@src/types/Playlist";

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: (playlist: Playlist) => void;
  isPlaying: boolean;
  onPlayClick: (playlist: Playlist) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onClick,
  isPlaying,
  onPlayClick,
}) => {
  const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onPlayClick(playlist);
  };

  return (
    <div
      className="bg-surface p-4 rounded-md card-hover transition-all cursor-pointer group relative"
      onClick={() => onClick(playlist)}
    >
      <div className="relative mb-4">
        <img
          src={playlist.coverImageUrl}
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button
          className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105 transform transition"
          onClick={handlePlayClick}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
      <h3 className="font-semibold truncate">{playlist.name}</h3>
      <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
    </div>
  );
};

export default PlaylistCard;
