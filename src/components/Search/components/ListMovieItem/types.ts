import { Movie } from "@/types";

export interface IListMovieProps {
  movie: Movie;
  query: string;
  isFocused: boolean;
}
