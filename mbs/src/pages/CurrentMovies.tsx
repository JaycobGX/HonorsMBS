import { useEffect, useState } from "react";
import { db } from "../firebase/db";
import type { Movie } from "../types/Movie";
import MovieCard from "../components/MovieCard";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function CurrentMovies() {
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesRef = collection(db, "movies");

      const currentQuery = query(moviesRef, where("status", "==", "current"));

      const currentSnap = await getDocs(currentQuery);

      setCurrentMovies(
        currentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Movie[]
      );
    };
    fetchMovies();
  }, []);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "98vw",
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const sectionStyle: React.CSSProperties = {
    margin: "30px 0",
    width: "100%",
    maxWidth: "1200px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const moviesRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  };

  return (
    <div style={pageStyle}>
      <div style={sectionStyle}>
        <h1 style={titleStyle}>Current Movies</h1>
        <div style={moviesRowStyle}>
          {currentMovies.map((m) => (
            <MovieCard movie={m} key={m.id} />
          ))}
        </div>
      </div>
    </div>
  );
}