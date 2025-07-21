"use client";

import Favorites from "@/components/Favorites/Favorites";
import Search from "@/components/Search/Search";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <Search />
      <Favorites />
    </main>
  );
}
