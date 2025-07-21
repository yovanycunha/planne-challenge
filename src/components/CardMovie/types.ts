import { Movie } from "@/types";

export interface IMovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  isFocused: boolean;
}
