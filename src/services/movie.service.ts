import { tmdbApi } from "./client/client";

export class MovieService {
  static async searchMovie(query: string) {
    try {
      const response = await tmdbApi.get(
        `search/movie?query=${query}&include_adult=false&language=en-US&page=1`
      );

      return response;
    } catch (error) {
      console.error("Error searching for movie:", error);
      throw new Error("Failed to search for movie");
    }
  }
}
