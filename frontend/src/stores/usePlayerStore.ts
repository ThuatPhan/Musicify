import type { Song } from "@src/types/Song";
import { create } from "zustand";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
}

const usePlayerStore = create<PlayerState>((set, get) => {
  const audio = new Audio();

  return {
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 80,

    playSong: (song) => {
      if (get().currentSong?.id !== song.id) {
        audio.src = song.sourceUrl;
        audio.currentTime = 0;
      }
      audio.play();
      set({ currentSong: song, isPlaying: true, currentTime: 0 });

      audio.ontimeupdate = () => set({ currentTime: audio.currentTime });
      audio.onloadedmetadata = () => set({ duration: audio.duration });
      audio.onended = () => set({ isPlaying: false });
    },

    pauseSong: () => {
      audio.pause();
      set({ isPlaying: false });
    },

    resumeSong: () => {
      audio.play();
      set({ isPlaying: true });
    },

    setCurrentTime: (time) => {
      audio.currentTime = time;
      set({ currentTime: time });
    },

    setVolume: (volume) => {
      audio.volume = volume / 100;
      set({ volume });
    },
  };
});

export default usePlayerStore;
