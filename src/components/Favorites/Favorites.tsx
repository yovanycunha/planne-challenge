import { useMovieStore } from "@/store/movie.store";
import MovieCard from "../CardMovie/CardMovie";
import styles from "./Favorites.module.scss";

const Favorites: React.FC = () => {
  const { favorites } = useMovieStore();

  const listContainerClass = [styles.listContainer];

  if (favorites.length === 0) listContainerClass.push(styles.hidden);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Favoritos</h2>
      <div className={listContainerClass.join(" ")}>
        {favorites.map((fv) => (
          <MovieCard
            key={fv.id}
            movie={fv}
            isFavorite={true}
            isFocused={false}
          />
        ))}
      </div>
      {favorites.length === 0 && (
        <div className={styles.disclaimerContainer}>
          <p className={styles.disclaimerMsg}>
            Ops, nada por aqui ainda. Marque filmes como favoritos para vê-los
            listados aqui!
          </p>
        </div>
      )}
    </section>
  );
};

export default Favorites;
