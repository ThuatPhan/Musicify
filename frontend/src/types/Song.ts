import { Artist } from "@src/types/Artist";
import { Genre } from "@src/types/Genre";
import { Lyric } from "@src/types/Lyric";

export type Song = {
  id: string;
  name: string;
  duration: number;
  sourceUrl: string;
  coverImageUrl: string;
  releaseDate: string;
  lyric: Lyric
  artist: Artist;
  genre: Genre;
};
