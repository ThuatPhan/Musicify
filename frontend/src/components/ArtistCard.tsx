import type React from "react";
import { Play } from "lucide-react";
import { Artist } from "@src/types/Artist";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-surface p-4 rounded-md card-hover transition-all cursor-pointer group"
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <div className="relative mb-4">
        <img
          src={artist.avatar}
          alt={artist.name}
          className="w-full aspect-square object-cover rounded-full shadow-lg"
        />
        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105 transform transition">
          <Play size={20} />
        </button>
      </div>
      <h3 className="font-semibold text-center truncate">{artist.name}</h3>
      <p className="text-gray-400 text-sm text-center">Artist</p>
    </div>
  );
};

export default ArtistCard;
