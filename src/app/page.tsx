"use client";
import { MovieService } from "@/services/movie.service";
import styles from "./page.module.css";
import Input from "@/components/Input/Input";
import { useReducer } from "react";
import { Movie } from "@/types";
import {
  initialSearchState,
  searchReducer,
} from "@/reducers/search/searchReducer";

export default function Home() {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 3) {
      dispatch({ type: "SET_QUERY", payload: "" });
      dispatch({ type: "SET_RESPONSE", payload: [] });
      return;
    }

    const { data } = await MovieService.searchMovie(e.target.value);

    dispatch({ type: "SET_QUERY", payload: e.target.value });
    dispatch({ type: "SET_RESPONSE", payload: data.results });
  };

  function highlightSubstring(title: string, query: string) {
    const index = title.toLowerCase().indexOf(query.toLowerCase());

    if (index === -1) return <p>{title}</p>;

    const start = title.slice(0, index);
    const match = title.slice(index, index + query.length);
    const end = title.slice(index + query.length);

    return (
      <p>
        {start}
        <span className={styles.highlight}>{match}</span>
        {end}
      </p>
    );
  }

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
        <div className={styles.responseContainer}>
          {state.response.map((mv: Movie) => (
            <div key={mv.id} className={styles.response}>
              {highlightSubstring(mv.title, state.query)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
