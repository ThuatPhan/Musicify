"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Search, Users, Filter, ArrowUpDown } from "lucide-react";
import MobileNav from "@src/components/MobileNav";
import ArtistCard from "@src/components/ArtistCard";
import { useArtistStore } from "@src/stores/useArtistStore";
import type { Artist } from "@src/types/Artist";
import SkeletonArtistCard from "@src/components/SkeletonArtistCard";
import ErrorCard from "@src/components/ErrorCard";
import { NotificationType } from "@src/types/Enums";
import AppError from "@src/utils/AppError";

type SortField = "name";
type SortOrder = "asc" | "desc";

const AllArtists: React.FC = () => {
  const { getArtists, artists, loading, notification } = useArtistStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Load artists when component mounts
  useEffect(() => {
    const loadArtists = async () => {
      await getArtists();
    };

    loadArtists();
  }, []);

  // Filter and sort artists when dependencies change
  useEffect(() => {
    if (!artists) return;

    let result = [...artists];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((artist) =>
        artist.name.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredArtists(result);
  }, [artists, searchTerm, sortField, sortOrder]);

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

  // Generate skeleton arrays for loading state
  const skeletonCount = 12;
  const skeletonArray = Array(skeletonCount).fill(null);

  if (notification && notification.type === NotificationType.ERROR) {
    return <ErrorCard error={new AppError(notification.message)} />;
  }

  return (
    <div className="pb-20 md:pb-0">
      <MobileNav />

      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-4">All Artists</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search artists..."
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
            </div>
          </div>
        )}
      </header>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skeletonArray.map((_, index) => (
            <SkeletonArtistCard key={`skeleton-${index}`} />
          ))}
        </div>
      ) : filteredArtists.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>

          <div className="mt-6 text-center text-gray-400">
            Showing {filteredArtists.length} of {artists.length} artists
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Users size={48} className="mb-4 opacity-50" />
          {searchTerm ? (
            <p>No artists found matching "{searchTerm}"</p>
          ) : (
            <p>No artists available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllArtists;
