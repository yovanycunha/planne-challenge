import { tmdbApi } from "./client/client";

export class MovieService {
  static async searchMovies(query: string) {
    try {
      const response = await tmdbApi.get(
        `search/movie?query=${query}&include_adult=false&language=en-US&page=1`
      );

      return response;
    } catch (error) {
      console.error("Error searching for movies:", error);
      throw new Error("Failed to search for movies");
    }
  }

  static async searchMovie(id: number) {
    try {
      const response = await tmdbApi.get(`movie/${id}?language=en-US'`);

      return response;
    } catch (error) {
      console.error("Error searching for an movie:", error);
      throw new Error("Failed to search for and movie");
    }
  }
}
