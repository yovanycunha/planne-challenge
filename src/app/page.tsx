"use client";
import { MovieService } from "@/services/movie.service";
import styles from "./page.module.css";
import Input from "@/components/Input/Input";

export default function Home() {
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { data } = await MovieService.searchMovie(e.target.value);
  };

  return (
    <div className={styles.page}>
      <div>
        <Input
          label="Pesquise um Filme"
          placeholder="Ex: Star Wars"
          name="search-movie"
          hint="Utilize as teclas ↓ ↑ para navegar entre as opções"
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}
