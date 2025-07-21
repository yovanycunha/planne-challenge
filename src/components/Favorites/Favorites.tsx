import { useMovieStore } from "@/store/movie.store";

const Favorites: React.FC = () => {
  const { favorites } = useMovieStore();
  return (
    <section>
      {favorites.length > 0 && (
        <div>
          {favorites.map((fv) => (
            <p key={fv.id}>{fv.title}</p>
          ))}
        </div>
      )}
    </section>
  );
};

export default Favorites;
