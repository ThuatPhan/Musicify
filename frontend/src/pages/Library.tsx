"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@src/components/Tabs";
import SongCard from "@src/components/SongCard";
import ArtistCard from "@src/components/ArtistCard";
import MobileNav from "@src/components/MobileNav";
import { useArtistStore } from "@src/stores/useArtistStore";
import { useSongStore } from "@src/stores/useSongStore";
import useAuthStore from "@src/stores/useAuthStore";
import SkeletonSongCard from "@src/components/SkeletonSongCard";
import SkeletonArtistCard from "@src/components/SkeletonArtistCard";
import RequireLoginScreen from "@src/components/RequireLoginScreen";

const Library: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuthStore();
  const { getArtists, artists } = useArtistStore();
  const { getSongs, songs } = useSongStore();

  const [loadingData, setLoadingData] = useState(true);
  const loading = isLoading || loadingData;
  const [activeTab, setActiveTab] = useState("songs");

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([getArtists(), getSongs()]);
      setLoadingData(false);
    };

    if (!isLoading && isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn, isLoading]);

  if (!isLoggedIn) {
    return (
      <RequireLoginScreen
        feature="Library"
        message="Please login to view your library"
      />
    );
  }

  // Generate skeleton arrays
  const skeletonCount = 10;
  const skeletonArray = Array(skeletonCount).fill(null);

  return (
    <div className="pb-20 md:pb-0">
      <MobileNav />
      <>
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Your Library</h1>
        </header>

        <Tabs
          defaultValue="songs"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {" "}
          <TabsList className="mb-6">
            <TabsTrigger value="songs" className="px-4 py-2 rounded-md">
              Liked Songs
            </TabsTrigger>
            <TabsTrigger value="artists" className="px-4 py-2 rounded-md">
              Artists
            </TabsTrigger>
          </TabsList>
          <TabsContent value="songs">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {loading ? (
                skeletonArray.map((_, index) => (
                  <SkeletonSongCard key={`song-skeleton-${index}`} />
                ))
              ) : songs.length > 0 ? (
                songs.map((song) => <SongCard key={song.id} song={song} />)
              ) : (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No liked songs yet. Start exploring to find songs you love!
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="artists">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {loading ? (
                skeletonArray.map((_, index) => (
                  <SkeletonArtistCard key={`artist-skeleton-${index}`} />
                ))
              ) : artists.length > 0 ? (
                artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No followed artists yet. Discover new artists to follow!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </>
    </div>
  );
};

export default Library;
