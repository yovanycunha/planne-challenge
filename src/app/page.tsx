"use client";

import { MovieService } from "@/services/movie.service";
import styles from "./page.module.scss";
import Input from "@/components/Input/Input";
import { useReducer } from "react";
import { Movie } from "@/types";
import {
  initialSearchState,
  searchReducer,
} from "@/reducers/search/searchReducer";
import MovieCard from "@/components/CardMovie/CardMovie";

export default function Home() {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

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
      return;
    }

    const { data } = await MovieService.searchMovies(e.target.value);

    if (data.total_results === 0) {
      dispatch({ type: "SET_EMPTY_SEARCH", payload: true });
    }

    dispatch({ type: "SET_QUERY", payload: e.target.value });
    dispatch({ type: "SET_RESPONSE", payload: data.results });
  };

  function renderMovie(title: string, originalTitle: string, query: string) {
    let outputTitle = title;
    let index = title.toLowerCase().indexOf(query.toLowerCase());

    if (index === -1) {
      index = originalTitle.toLowerCase().indexOf(query.toLowerCase());

      if (index === -1)
        return (
          <div className={styles.responseWrapper}>
            <p>{title}</p>
          </div>
        );

      outputTitle = originalTitle;
    }

    const start = outputTitle.slice(0, index);
    const match = outputTitle.slice(index, index + query.length);
    const end = outputTitle.slice(index + query.length);

    return (
      <div className={styles.responseWrapper}>
        <p className={styles.response}>
          {start}
          <span className={styles.highlight}>{match}</span>
          {end}
        </p>
      </div>
    );
  }

  console.log("state", state);

  return (
    <div className={styles.page}>
      <div className={styles.searchContainer}>
        <Input
          label="Pesquise um Filme"
          placeholder="Ex: Star Wars"
          name="search-movie"
          hint="Utilize as teclas ↓ ↑ para navegar entre as opções"
          onChange={handleSearch}
        />
      </div>
      {state.response.length > 0 && (
        <div className={styles.responsesContainer}>
          {state.response.map((mv: Movie, index: number) => (
            <div key={mv.id}>
              {index === 0 && validateTitleAndQuery(mv, state.query) ? (
                <MovieCard movie={mv} />
              ) : (
                renderMovie(mv.title, mv.original_title, state.query)
              )}
            </div>
          ))}
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
    </div>
  );
}
