import { useMovieStore } from "@/store/movie.store";
import Input from "../Input/Input";
import useIsDesktop from "@/hooks/useIsDesktop";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  initialSearchState,
  searchReducer,
} from "@/reducers/search/searchReducer";
import styles from "./Search.module.scss";
import { MovieService } from "@/services/movie.service";
import { Movie } from "@/types";
import MovieCard from "../CardMovie/CardMovie";
import StarSVG from "./images/star-icon.svg";
import FavoriteSVG from "./images/is-fav-icon.svg";

const Search: React.FC = () => {
  const { favorites, addFavorite, isFavorite } = useMovieStore();

  const isDesktop = useIsDesktop();

  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  const observerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentPage = useRef(1);

  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleInputFocus = () => {
    setFocusedIndex(-1);
  };

  const iconClass = [styles.iconWrapper];

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
      currentPage.current = 1;
      setFocusedIndex(-1);
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
      setFocusedIndex((prev) => (prev + 1) % state.response.length);

      if (focusedIndex === state.response.length - 2) {
        loadMoreMovies();
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(
        (prev) => (prev - 1 + state.response.length) % state.response.length
      );
      return;
    }

    if (e.key === " " && focusedIndex !== -1) {
      e.preventDefault();
      addFavorite(state.response[focusedIndex]);
      return;
    }

    setFocusedIndex(-1);
  };

  const getFocusedStyle = (index: number) => {
    if (index === focusedIndex) return `${styles.focused}`;
  };

  function renderMovie(movie: Movie, query: string, index: number) {
    let outputTitle = movie.title;
    let queryIndex = movie.title.toLowerCase().indexOf(query.toLowerCase());

    const shouldRenderMobileFav = index === focusedIndex && !isDesktop;

    if (queryIndex === -1) {
      queryIndex = movie.original_title
        .toLowerCase()
        .indexOf(query.toLowerCase());

      if (queryIndex === -1)
        return (
          <div className={styles.responseWrapper}>
            <p>{movie.title}</p>

            <div className={iconClass.join(" ")}>
              {shouldRenderMobileFav &&
                (isFavorite(movie.id) ? <FavoriteSVG /> : <StarSVG />)}
            </div>
          </div>
        );

      outputTitle = movie.original_title;
    }

    const start = outputTitle.slice(0, queryIndex);
    const match = outputTitle.slice(queryIndex, queryIndex + query.length);
    const end = outputTitle.slice(queryIndex + query.length);

    return (
      <div className={styles.responseWrapper}>
        <p className={styles.response}>
          {start}
          <span className={styles.highlight}>{match}</span>
          {end}
        </p>

        <div className={iconClass.join(" ")}>
          {shouldRenderMobileFav &&
            (isFavorite(movie.id) ? <FavoriteSVG /> : <StarSVG />)}
        </div>
      </div>
    );
  }

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
    if (focusedIndex < 0) return;
    const element = document.getElementById(`response-item-${focusedIndex}`);
    if (element) {
      element.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

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
                <MovieCard movie={mv} />
              ) : (
                renderMovie(mv, state.query, index)
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
