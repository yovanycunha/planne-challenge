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

  const renderFavorite = () => (
    <div className={styles.iconWrapper}>
      <FavoriteSVG />
    </div>
  );

  const renderStar = () => {
    if (isHovered || isFocused) {
      return (
        <div className={styles.iconWrapper} onClick={() => addFavorite(movie)}>
          <StarSVG />
        </div>
      );
    }
  };

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

      {isFavorite(movie.id) ? renderFavorite() : renderStar()}
    </div>
  );

  const renderItem = () => (
    <div
      className={styles.responseWrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p>{movie.title}</p>

      {isFavorite(movie.id) ? renderFavorite() : renderStar()}
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
