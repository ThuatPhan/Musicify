import { fetchApi } from "@src/service/ApiService";
import { Song } from "@src/types/Song";
import { NotificationType } from "@src/types/Enums";
import { Notification } from "@src/types/Notification";
import { create } from "zustand";
import AppError from "@src/utils/AppError";
import { Lyric } from "@src/types/Lyric";

interface SongState {
  loading: boolean;

  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;

  song: Song | null;
  lyric: Lyric | null;
  songs: Song[];

  getSong: (id: string) => Promise<void>;
  getSongs: () => Promise<void>;
  getSongsOfArtist: (artistId: string) => Promise<void>;
}

export const useSongStore = create<SongState>((set) => ({
  loading: false,

  notification: null,
  setNotification: (notification) => set({ notification }),

  song: null,
  lyric: null,

  songs: [],

  getSong: async (id) => {
    set({ loading: true });
    try {
      const songPromises = await Promise.all([
        fetchApi<Song>(`api/song/${id}`),
        fetchApi<Lyric>(`api/song/lyric/${id}`),
      ]);

      set({
        song: songPromises[0],
        lyric: songPromises[1],
        loading: false,
      });
    } catch (error) {
      set({
        notification: {
          message:
            error instanceof AppError ? error.message : "Failed to fetch song ",
          type: NotificationType.ERROR,
        },
        loading: false,
      });
    }
  },

  getSongs: async () => {
    set({ loading: true });
    try {
      const songs = await fetchApi<Song[]>("api/song");

      set({
        songs,
        notification: {
          message: "Fetched songs successfully",
          type: NotificationType.SUCCESS,
        },
        loading: false,
      });
    } catch (error) {
      set({
        notification: {
          message:
            error instanceof AppError ? error.message : "Failed to fetch songs",
          type: NotificationType.ERROR,
        },
        loading: false,
      });
    }
  },

  getSongsOfArtist: async (artistId: string) => {
    set({ loading: true });
    try {
      const songs = await fetchApi<Song[]>(`api/song/artist/${artistId}`);
      set({
        songs,
        notification: {
          message: "Fetched artist's songs successfully",
          type: NotificationType.SUCCESS,
        },
        loading: false,
      });
    } catch (error) {
      set({
        notification: {
          message:
            error instanceof AppError
              ? error.message
              : "Failed to fetch songs of artist",
          type: NotificationType.ERROR,
        },
        loading: false,
      });
    }
  },
}));
