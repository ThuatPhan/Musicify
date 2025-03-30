import { fetchApi } from "@src/service/ApiService";
import { Artist } from "@src/types/Artist";
import { NotificationType } from "@src/types/Enums";
import { Notification } from "@src/types/Notification";
import AppError from "@src/utils/AppError";
import { create } from "zustand";

interface ArtistState {
  loading: boolean;

  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;

  artist: Artist | null;
  artists: Artist[];

  createArtist: (
    artist: Omit<Artist, "id" | "avatar">,
    avatarFile: File,
    token: string
  ) => Promise<void>;
  getArtist: (id: string) => Promise<void>;
  getArtists: () => Promise<void>;
  updateArtist: (
    artist: Omit<Artist, "avatar">,
    token: string,
    avatarFile?: File
  ) => Promise<void>;
  deleteArtist: (id: string, token: string) => Promise<void>;
}

export const useArtistStore = create<ArtistState>((set) => ({
  loading: false,

  notification: null,
  setNotification: (notification) => set({ notification }),

  artist: null,
  artists: [],

  createArtist: async (artist, avatarFile, token) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append("name", artist.name);
      formData.append("dateOfBirth", artist.dateOfBirth);
      formData.append("sex", artist.sex);
      formData.append("avatarFile", avatarFile);

      const newArtist = await fetchApi<Artist>("api/artist", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      set((state) => ({
        loading: false,
        artists: [...state.artists, newArtist],
        notification: {
          message: "Artist created successfully",
          type: NotificationType.SUCCESS,
        },
      }));
    } catch (error) {
      set({
        loading: false,
        notification: {
          message:
            error instanceof AppError
              ? error.message
              : "Failed to create artist",
          type: NotificationType.ERROR,
        },
      });
    }
  },

  getArtist: async (id: string) => {
    set({ loading: true });
    try {
      const artist = await fetchApi<Artist>(`api/artist/${id}`);
      set({ artist, loading: false });
    } catch (error) {
      set({
        loading: false,
        notification: {
          message:
            error instanceof AppError
              ? error.message
              : "Failed to fetch artist",
          type: NotificationType.ERROR,
        },
      });
    }
  },

  getArtists: async () => {
    set({ loading: true });
    try {
      const artists = await fetchApi<Artist[]>("api/artist");
      set({ artists, loading: false });
    } catch (error) {
      set({
        loading: false,
        notification: {
          message:
            error instanceof AppError
              ? error.message
              : "Failed to fetch artists",
          type: NotificationType.ERROR,
        },
      });
    }
  },

  updateArtist: async (artist, token, avatarFile) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append("name", artist.name);
      formData.append("dateOfBirth", artist.dateOfBirth);
      formData.append("sex", artist.sex);
      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }

      const updatedArtist = await fetchApi<Artist>(`api/artist/${artist.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      set((state) => ({
        loading: false,
        artists: state.artists.map((a) =>
          a.id === updatedArtist.id ? updatedArtist : a
        ),
        notification: {
          message: "Artist updated successfully",
          type: NotificationType.SUCCESS,
        },
      }));
    } catch (error) {
      set({
        loading: false,
        notification: {
          message:
            error instanceof AppError
              ? error.message
              : "Failed to update artist",
          type: NotificationType.ERROR,
        },
      });
    }
  },

  deleteArtist: async (id: string, token: string) => {
    set({ loading: true });
    try {
      await fetchApi<void>(`api/artist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        loading: false,
        artists: state.artists.filter((artist) => artist.id !== id),
        notification: {
          message: "Artist deleted successfully",
          type: NotificationType.SUCCESS,
        },
      }));
    } catch (error) {
      set({
        loading: false,
        notification: {
          message:
            error instanceof AppError
              ? error.message
              : "Failed to delete artist",
          type: NotificationType.ERROR,
        },
      });
    }
  },
}));
