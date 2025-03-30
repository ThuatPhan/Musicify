import { fetchApi } from "@src/service/ApiService";
import { NotificationType } from "@src/types/Enums";
import { Genre } from "@src/types/Genre";
import { Notification } from "@src/types/Notification";
import AppError from "@src/utils/AppError";
import { create } from "zustand";

interface GenreState {
  loading: boolean;

  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;

  genre: Genre | null;
  genres: Genre[];

  createGenre: (data: Partial<Genre>, token: string) => Promise<void>;
  getGenre: (id: string) => Promise<void>;
  getGenres: () => Promise<void>;
  updateGenre: (
    id: string,
    data: Partial<Genre>,
    token: string
  ) => Promise<void>;
  deleteGenre: (id: string, token: string) => Promise<void>;
}

export const useGenreStore = create<GenreState>((set) => ({
  loading: false,

  notification: null,
  setNotification: (notification) => set({ notification }),

  genre: null,
  genres: [],

  createGenre: async (data, token) => {
    set({ loading: true });
    try {
      const newGenre = await fetchApi<Genre>("api/genre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      set((state) => ({
        loading: false,
        genres: [...state.genres, newGenre],
        notification: {
          message: "Genre created successfully",
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
              : "Failed when creating genre",
          type: NotificationType.ERROR,
        },
      });
    }
  },

  getGenre: async (id) => {
    set({ loading: true });
    try {
      const genre = await fetchApi<Genre>(`api/genre/${id}`);
      set({ loading: false, genre });
    } catch (error) {
      set({
        loading: false,
        notification: {
          message:
            error instanceof AppError ? error.message : "Failed to fetch genre",
          type: NotificationType.ERROR,
        },
      });
    }
  },

  getGenres: async () => {
    set({ loading: true });
    try {
      const genres = await fetchApi<Genre[]>("api/genre");
      set({ loading: false, genres });
    } catch (error) {
      set({
        loading: false,
        notification: {
          message:
            error instanceof AppError
              ? error.message
              : "Failed to fetch genres",
          type: NotificationType.ERROR,
        },
      });
    }
  },

  updateGenre: async (id, data, token) => {
    set({ loading: true });
    try {
      const updatedGenre = await fetchApi<Genre>(`api/genre/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      set((state) => ({
        loading: false,
        genres: state.genres.map((g) => (g.id === id ? updatedGenre : g)),
        notification: {
          message: "Genre updated successfully",
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
              : "Failed to update genre",
          type: NotificationType.ERROR,
        },
      });
    }
  },

  deleteGenre: async (id, token) => {
    set({ loading: true });
    try {
      await fetchApi(`api/genre/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        loading: false,
        genres: state.genres.filter((g) => g.id !== id),
        notification: {
          message: "Genre deleted successfully",
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
              : "Failed to delete genre",
          type: NotificationType.ERROR,
        },
      });
    }
  },
}));
