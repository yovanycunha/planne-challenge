import { useMovieStore } from "@/store/movie.store";
import Input from "../Input/Input";
import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  initialSearchState,
  searchReducer,
} from "@/reducers/search/searchReducer";
import styles from "./Search.module.scss";
import { MovieService } from "@/services/movie.service";
import { Movie } from "@/types";
import MovieCard from "../CardMovie/CardMovie";
import ListMovieItem from "./components/ListMovieItem/ListMovieItem";

const Search: React.FC = () => {
  const { addFavorite, isFavorite, removeFavorite } = useMovieStore();

  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  const observerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentPage = useRef(1);

  const handleInputFocus = () => {
    dispatch({ type: "SET_FOCUSED_INDEX", payload: -1 });
  };

  const validateTitleAndQuery = (movie: Movie, query: string): boolean => {
    if (
      movie.title.toLocaleLowerCase() !== query.toLocaleLowerCase() &&
      movie.original_title.toLocaleLowerCase() !== query.toLocaleLowerCase()
    ) {
      return false;
    }
    return true;
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 3) {
      dispatch({ type: "SET_QUERY", payload: "" });
      dispatch({ type: "SET_RESPONSE", payload: [] });
      dispatch({ type: "SET_EMPTY_SEARCH", payload: false });
      dispatch({ type: "SET_FOCUSED_INDEX", payload: -1 });
      currentPage.current = 1;
      return;
    }

    currentPage.current = 1;
    const { data } = await MovieService.searchMovies(e.target.value, 1);

    if (data.total_results === 0) {
      dispatch({ type: "SET_EMPTY_SEARCH", payload: true });
    }

    dispatch({ type: "SET_QUERY", payload: e.target.value });
    dispatch({ type: "SET_RESPONSE", payload: data.results });
  };

  const loadMoreMovies = useCallback(async () => {
    if (!state.query || state.isResponseEmpty) return;

    currentPage.current += 1;
    const { data } = await MovieService.searchMovies(
      state.query,
      currentPage.current
    );

    if (data.results.length > 0) {
      dispatch({ type: "APPEND_RESPONSE", payload: data.results });
    }
  }, [state.query, state.isResponseEmpty]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (state.response.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      dispatch({
        type: "SET_FOCUSED_INDEX",
        payload: (state.focusedIndex + 1) % state.response.length,
      });

      if (state.focusedIndex === state.response.length - 2) {
        loadMoreMovies();
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      dispatch({
        type: "SET_FOCUSED_INDEX",
        payload:
          (state.focusedIndex - 1 + state.response.length) %
          state.response.length,
      });
      return;
    }

    if (e.key === " " && state.focusedIndex !== -1) {
      e.preventDefault();
      if (isFavorite(state.response[state.focusedIndex].id)) {
        removeFavorite(state.response[state.focusedIndex].id);
      } else {
        addFavorite(state.response[state.focusedIndex]);
      }

      return;
    }

    dispatch({ type: "SET_FOCUSED_INDEX", payload: -1 });
  };

  const getFocusedStyle = (index: number) => {
    if (index === state.focusedIndex) return `${styles.focused}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMovies();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreMovies]);

  useEffect(() => {
    if (state.focusedIndex < 0) return;
    const element = document.getElementById(
      `response-item-${state.focusedIndex}`
    );
    if (element) {
      element.scrollIntoView({ block: "nearest" });
    }
  }, [state.focusedIndex]);

  return (
    <section className={styles.container}>
      <div className={styles.inputContainer} onClick={handleInputFocus}>
        <Input
          label="Pesquise um Filme"
          placeholder="Ex: Star Wars"
          name="search-movie"
          hint="Utilize as teclas ↓ ↑ para navegar entre as opções"
          onChange={handleSearch}
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
        />
      </div>
      {state.response.length > 0 && (
        <div className={styles.responsesContainer}>
          {state.response.map((mv: Movie, index: number) => (
            <div
              key={`${mv.id}-${index}`}
              id={`response-item-${index}`}
              className={getFocusedStyle(index)}
            >
              {index === 0 && validateTitleAndQuery(mv, state.query) ? (
                <MovieCard
                  movie={mv}
                  isFavorite={isFavorite(mv.id)}
                  isFocused={state.focusedIndex === 0}
                />
              ) : (
                <ListMovieItem
                  movie={mv}
                  isFocused={state.focusedIndex === index}
                  query={state.query}
                  key={mv.id}
                />
              )}
            </div>
          ))}
          <div ref={observerRef} />
        </div>
      )}
      {state.isResponseEmpty && (
        <div className={styles.responsesContainer}>
          <div className={styles.disclaimerContainer}>
            <p className={styles.disclaimerMsg}>
              Ops! Nada encontrado para <i>{state.query}</i>. Que tal tentar
              outra palavra ou{" "}
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  state.query
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.disclaimerLink}
              >
                buscar no Google
              </a>
              ?
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Search;
