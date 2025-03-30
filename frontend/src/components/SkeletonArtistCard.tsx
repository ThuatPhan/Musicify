import type React from "react";

const SkeletonArtistCard: React.FC = () => {
  return (
    <div className="bg-surface p-4 rounded-md">
      <div className="relative mb-4">
        <div className="w-full aspect-square bg-gray-700 rounded-full animate-pulse"></div>
      </div>
      <div className="h-5 bg-gray-700 rounded w-1/2 mx-auto mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto animate-pulse"></div>
    </div>
  );
};

export default SkeletonArtistCard;
