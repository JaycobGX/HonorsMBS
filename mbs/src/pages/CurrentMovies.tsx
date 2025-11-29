import { useEffect, useState } from "react";
import { db } from "../firebase/db";
import type { Movie } from "../types/Movie";
import MovieCard from "../components/MovieCard";
import { collection, getDocs, query, where } from "firebase/firestore";

// holds the list of movies that are currently playing
export default function CurrentMovies() {
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);

// get all the movies whose "status" field is set to "current"
  useEffect(() => {
    const fetchMovies = async () => {
      const moviesRef = collection(db, "movies");

      const currentQuery = query(moviesRef, where("status", "==", "current")); // builds a Firestore query that filters movies by status

      const currentSnap = await getDocs(currentQuery); // get matching documents after running the query

      setCurrentMovies(
        currentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Movie[]
      );
    };
    fetchMovies();
  }, []);

// layout styling for the full page
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
// Heading style for the page title
  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

// grid layout for displaying movie cards side-by-side
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