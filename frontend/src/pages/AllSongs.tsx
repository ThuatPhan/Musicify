"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Search, Music, Filter, ArrowUpDown } from "lucide-react";
import MobileNav from "@src/components/MobileNav";
import SongRow from "@src/components/SongRow";
import { useSongStore } from "@src/stores/useSongStore";
import type { Song } from "@src/types/Song";
import SkeletonSongRow from "@src/components/SkeletonSongRow";
import ErrorCard from "@src/components/ErrorCard";
import { NotificationType } from "@src/types/Enums";
import AppError from "@src/utils/AppError";

type SortField = "name" | "artist" | "releaseDate";
type SortOrder = "asc" | "desc";

const AllSongs: React.FC = () => {
  const { getSongs, songs, loading, notification } = useSongStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Load songs when component mounts
  useEffect(() => {
    const loadSongs = async () => {
      await getSongs();
    };

    loadSongs();
  }, []);

  // Filter and sort songs when dependencies change
  useEffect(() => {
    if (!songs) return;

    let result = [...songs];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (song) =>
          song.name.toLowerCase().includes(term) ||
          song.artist.name.toLowerCase().includes(term) ||
          (song.genre && song.genre.name.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "artist":
          comparison = a.artist.name.localeCompare(b.artist.name);
          break;
        case "releaseDate":
          comparison =
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredSongs(result);
  }, [songs, searchTerm, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (notification && notification.type === NotificationType.ERROR) {
    return <ErrorCard error={new AppError(notification.message)} />;
  }

  // Generate skeleton arrays for loading state
  const skeletonCount = 10;
  const skeletonArray = Array(skeletonCount).fill(null);

  return (
    <div className="pb-20 md:pb-0">
      <MobileNav />

      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-4">All Songs</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search songs, artists, or genres..."
              className="bg-surface-light w-full pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter toggle button (mobile) */}
          <button
            className="md:hidden bg-surface-light p-2 rounded-md flex items-center justify-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>

          {/* Sort options (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-400">Sort by:</span>
            <button
              className={`flex items-center ${
                sortField === "name" ? "text-primary" : "text-gray-300"
              }`}
              onClick={() => handleSort("name")}
            >
              Name
              {sortField === "name" && (
                <ArrowUpDown size={16} className="ml-1" />
              )}
            </button>
            <button
              className={`flex items-center ${
                sortField === "artist" ? "text-primary" : "text-gray-300"
              }`}
              onClick={() => handleSort("artist")}
            >
              Artist
              {sortField === "artist" && (
                <ArrowUpDown size={16} className="ml-1" />
              )}
            </button>
            <button
              className={`flex items-center ${
                sortField === "releaseDate" ? "text-primary" : "text-gray-300"
              }`}
              onClick={() => handleSort("releaseDate")}
            >
              Release Date
              {sortField === "releaseDate" && (
                <ArrowUpDown size={16} className="ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile filters (collapsible) */}
        {showFilters && (
          <div className="md:hidden bg-surface-light p-4 rounded-md mb-4">
            <h3 className="font-medium mb-2">Sort by:</h3>
            <div className="flex flex-col gap-2">
              <button
                className={`flex items-center ${
                  sortField === "name" ? "text-primary" : "text-gray-300"
                }`}
                onClick={() => handleSort("name")}
              >
                Name {sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}
              </button>
              <button
                className={`flex items-center ${
                  sortField === "artist" ? "text-primary" : "text-gray-300"
                }`}
                onClick={() => handleSort("artist")}
              >
                Artist {sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}
              </button>
              <button
                className={`flex items-center ${
                  sortField === "releaseDate" ? "text-primary" : "text-gray-300"
                }`}
                onClick={() => handleSort("releaseDate")}
              >
                Release Date {sortOrder === "asc" ? "(Oldest)" : "(Newest)"}
              </button>
            </div>
          </div>
        )}
      </header>

      {loading ? (
        <div className="space-y-2">
          {skeletonArray.map((_, index) => (
            <SkeletonSongRow key={`skeleton-${index}`} />
          ))}
        </div>
      ) : filteredSongs.length > 0 ? (
        <>
          <div className="mb-4 grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 border-b border-gray-800 text-gray-400 text-sm">
            <div className="w-8">#</div>
            <div>Title</div>
            <div className="hidden md:block">Duration</div>
            <div></div>
          </div>

          <div className="space-y-2">
            {filteredSongs.map((song) => (
              <SongRow key={song.id} song={song} />
            ))}
          </div>

          <div className="mt-6 text-center text-gray-400">
            Showing {filteredSongs.length} of {songs.length} songs
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Music size={48} className="mb-4 opacity-50" />
          {searchTerm ? (
            <p>No songs found matching "{searchTerm}"</p>
          ) : (
            <p>No songs available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllSongs;
