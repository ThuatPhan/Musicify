import type React from "react";

const SkeletonSongRow: React.FC = () => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] gap-4 p-2 rounded-md items-center animate-pulse">
      <div className="w-8 h-8 bg-gray-700 rounded"></div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-700 rounded"></div>
        <div>
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
      <div className="hidden md:block w-12 h-4 bg-gray-700 rounded"></div>
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonSongRow;
