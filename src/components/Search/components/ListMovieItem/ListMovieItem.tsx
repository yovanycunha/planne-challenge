import { Movie } from "@/types";
import styles from "./ListMovieItem.module.scss";
import { useMovieStore } from "@/store/movie.store";
import StarSVG from "../../images/star-icon.svg";
import FavoriteSVG from "../../images/is-fav-icon.svg";
import { useState } from "react";
import { IListMovieProps } from "./types";

const ListMovieItem: React.FC<IListMovieProps> = ({
  movie,
  query,
  isFocused,
}) => {
  const { addFavorite, isFavorite } = useMovieStore();

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const renderFullItem = (start: string, match: string, end: string) => (
    <div
      className={styles.responseWrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className={styles.response}>
        {start}
        <span className={styles.highlight}>{match}</span>
        {end}
      </p>

      {(isFocused || isHovered) && (
        <div className={styles.iconWrapper} onClick={() => addFavorite(movie)}>
          {isFavorite(movie.id) ? <FavoriteSVG /> : <StarSVG />}
        </div>
      )}
    </div>
  );

  const renderItem = () => (
    <div
      className={styles.responseWrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p>{movie.title}</p>

      {(isFocused || isHovered) && (
        <div className={styles.iconWrapper} onClick={() => addFavorite(movie)}>
          {isFocused && isFavorite(movie.id) ? <FavoriteSVG /> : <StarSVG />}
        </div>
      )}
    </div>
  );

  const verifyTitles = () => {
    let outputTitle = movie.title;
    let queryIndex = movie.title.toLowerCase().indexOf(query.toLowerCase());

    if (queryIndex === -1) {
      queryIndex = movie.original_title
        .toLowerCase()
        .indexOf(query.toLowerCase());

      if (queryIndex === -1) return renderItem();

      outputTitle = movie.original_title;
    }

    const start = outputTitle.slice(0, queryIndex);
    const match = outputTitle.slice(queryIndex, queryIndex + query.length);
    const end = outputTitle.slice(queryIndex + query.length);

    return renderFullItem(start, match, end);
  };
  return <>{verifyTitles()}</>;
};

export default ListMovieItem;
