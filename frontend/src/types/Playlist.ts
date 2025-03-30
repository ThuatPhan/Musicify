import { Artist as User } from "@src/types/Artist";
import { Song } from "@src/types/Song";

export type Playlist = {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  owner: User | null;
  songs: Song[] | [];
};
