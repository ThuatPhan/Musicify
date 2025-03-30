import type React from "react";

const SkeletonSongCard: React.FC = () => {
  return (
    <div className="bg-surface p-4 rounded-md">
      <div className="relative mb-4">
        <div className="w-full aspect-square bg-gray-700 rounded-md animate-pulse"></div>
      </div>
      <div className="h-5 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
    </div>
  );
};

export default SkeletonSongCard;
