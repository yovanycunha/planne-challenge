import styles from "./CardMovie.module.scss";
import Image from "next/image";
import { POSTER_URL } from "@/utils/utils";
import { IMovieCardProps } from "./types";
import { useQuery } from "@tanstack/react-query";
import { MovieService } from "@/services/movie.service";
import { MovieDetails } from "@/types";
import ImageDefault from "./images/default_poster.png";
import StarSVG from "./images/star-icon.svg";
import FavoriteSVG from "./images/is-fav-icon.svg";

const MovieCard: React.FC<IMovieCardProps> = ({
  movie,
  isFavorite,
  isFocused,
}) => {
  const { data } = useQuery({
    queryKey: ["movieDetails"],
    queryFn: () => MovieService.searchMovie(movie.id),
  });

  const containerClass = [styles.cardContainer];

  const getReleaseYear = (): string => {
    let releaseYear = "-";

    if (movie.release_date) {
      releaseYear = movie.release_date.split("-")[0];
    }

    return releaseYear;
  };

  const handleRedirect = () => {
    window.open(`https://www.imdb.com/title/${data?.data.imdb_id}/`, "_blank");
  };

  const getPoster = () => {
    if (!movie.poster_path) {
      return ImageDefault;
    }

    return `${POSTER_URL}${movie.poster_path}`;
  };

  const renderGenres = () =>
    data?.data &&
    data.data.genres.map(
      (genre: MovieDetails["genres"][number], index: number) => (
        <span key={index} className={styles.genre}>
          {genre.name}
        </span>
      )
    );

  if (isFocused) containerClass.push(styles.focused);

  return (
    <div className={containerClass.join(" ")} onClick={handleRedirect}>
      <div className={styles.infoWrapper}>
        <div className={styles.imgContainer}>
          <Image
            alt={movie.title}
            fill
            style={{
              objectFit: "cover",
              borderRadius: "4px",
            }}
            src={getPoster()}
          />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.titleWrapper}>
            <p className={styles.cardTitle}>{movie.title}</p>
            <span className={styles.releaseYear}>({getReleaseYear()})</span>
          </div>
          <div className={styles.genresWrapper}>{renderGenres()}</div>
        </div>
      </div>
      <div className={styles.iconWrapper}>
        {isFavorite ? <FavoriteSVG /> : <StarSVG />}
      </div>
    </div>
  );
};

export default MovieCard;
