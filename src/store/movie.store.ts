import { create } from "zustand";
import { Movie } from "@/types";

interface MovieStoreState {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

export const useMovieStore = create<MovieStoreState>((set, get) => ({
  favorites: [],
  addFavorite: (movie) =>
    set((state) => ({
      favorites: state.favorites.some((m) => m.id === movie.id)
        ? state.favorites
        : [...state.favorites, movie],
    })),
  removeFavorite: (movieId) =>
    set((state) => ({
      favorites: state.favorites.filter((m) => m.id !== movieId),
    })),
  isFavorite: (movieId) => get().favorites.some((m) => m.id === movieId),
}));
