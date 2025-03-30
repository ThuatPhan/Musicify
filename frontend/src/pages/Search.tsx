"use client";

import type React from "react";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import SongCard from "@src/components/SongCard";
import ArtistCard from "@src/components/ArtistCard";
import MobileNav from "@src/components/MobileNav";
import { useSongStore } from "@src/stores/useSongStore";
import { useArtistStore } from "@src/stores/useArtistStore";
import type { Song } from "@src/types/Song";
import { SearchSuggestion } from "@src/types/SearchSuggestion";
import { SuggesstionType } from "@src/types/Enums";
import { useGenreStore } from "@src/stores/useGenreStore";
import { Artist } from "@src/types/Artist";

interface SearchResults {
  songs: Song[];
  artists: Artist[];
}

const Search: React.FC = () => {
  const { getSongs, songs } = useSongStore();
  const { getArtists, artists } = useArtistStore();
  const { getGenres, genres } = useGenreStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    songs: [],
    artists: [],
  });
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Memoize colors array to prevent recreation on each render
  const colors = useMemo(
    () => [
      "bg-purple-800",
      "bg-blue-800",
      "bg-green-800",
      "bg-red-800",
      "bg-yellow-800",
      "bg-pink-800",
      "bg-indigo-800",
      "bg-teal-800",
      "bg-orange-800",
      "bg-gray-800",
    ],
    []
  );

  // Memoize getRandomColor function
  const getRandomColor = useCallback(
    () => colors[Math.floor(Math.random() * colors.length)],
    [colors]
  );

  // Memoize genreColors to prevent recreations
  const genreColors = useMemo(() => {
    const colorMap: { [key: string]: string } = {};
    genres.forEach((genre) => {
      colorMap[genre.id] = getRandomColor();
    });
    return colorMap;
  }, [genres, getRandomColor]);

  // Load genres only once on mount
  useEffect(() => {
    getGenres();
  }, []);

  // Fetch data only once on mount and then filter locally
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([getSongs(), getArtists()]);
    };
    loadInitialData();
  }, []);

  // Memoize filtered search results based on searchTerm and data
  const filteredResults = useMemo(() => {
    if (searchTerm.trim() === "") {
      return {
        songs: [],
        artists: [],
      };
    }

    const term = searchTerm.toLowerCase();
    return {
      songs: songs.filter((song) => song.name.toLowerCase().includes(term)),
      artists: artists.filter((artist) =>
        artist.name.toLowerCase().includes(term)
      ),
    };
  }, [searchTerm, songs, artists]);

  // Update search results state when filteredResults changes
  useEffect(() => {
    setSearchResults(filteredResults);

    // Generate suggestions only when we have search results
    if (searchTerm.trim() !== "") {
      const newSuggestions: SearchSuggestion[] = [
        ...filteredResults.songs.slice(0, 3).map((song) => ({
          id: song.id,
          text: song.name,
          type: SuggesstionType.SONG,
        })),
        ...filteredResults.artists.slice(0, 3).map((artist) => ({
          id: artist.id,
          text: artist.name,
          type: SuggesstionType.ARTIST,
        })),
      ];
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [filteredResults, searchTerm]);

  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion): void => {
      setSearchTerm(suggestion.text);
      setShowSuggestions(false);
    },
    []
  );

  return (
    <div className="pb-20 md:pb-0">
      <MobileNav />

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>

        <div className="relative">
          <div className="flex items-center bg-surface-light rounded-full px-4 py-2">
            <SearchIcon size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              className="bg-transparent border-none outline-none w-full text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-light rounded-md shadow-lg z-10">
              <ul>
                {suggestions.map((suggestion) => (
                  <li
                    key={`${suggestion.type}-${suggestion.id}`}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm mr-2">
                        {suggestion.type === SuggesstionType.SONG
                          ? "🎵"
                          : suggestion.type === SuggesstionType.ARTIST
                          ? "👤"
                          : "📁"}
                      </span>
                      <span>{suggestion.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {searchTerm.trim() !== "" && (
        <div className="space-y-8">
          {searchResults.songs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Songs</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {searchResults.songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </section>
          )}

          {searchResults.artists.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {searchResults.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {searchResults.songs.length === 0 &&
            searchResults.artists.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No results found for "{searchTerm}"
                </p>
              </div>
            )}
        </div>
      )}

      {searchTerm.trim() === "" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className={`${
                genreColors[genre.id] || "bg-gray-800"
              } rounded-lg p-4 aspect-square flex items-center justify-center`}
            >
              <span className="text-xl font-bold">{genre.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
