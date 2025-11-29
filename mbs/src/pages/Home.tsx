import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/db";
import type { Movie } from "../types/Movie";
import MovieCard from "../components/MovieCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Separate lists for current, upcoming, and all movies which will be used for search
export default function Home() {
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  // Search input and filtered dropdown results
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null); // used to detect clicks outside of the dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesRef = collection(db, "movies"); // get both current and upcoming movies from Firestore

      const currentQuery = query(moviesRef, where("status", "==", "current"));
      const upcomingQuery = query(moviesRef, where("status", "==", "upcoming"));

      const currentSnap = await getDocs(currentQuery);
      const upcomingSnap = await getDocs(upcomingQuery);

      const curr = currentSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Movie[];
      const upc = upcomingSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Movie[];

      setCurrentMovies(curr);
      setUpcomingMovies(upc);
      setAllMovies([...curr, ...upc]); // store all movies for search functionality
    };

    fetchMovies();
  }, []);

  // Handle search
  useEffect(() => {
    if (search.trim() === "") {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }

    const results = allMovies.filter((m) =>
      m.title.toLowerCase().includes(search.toLowerCase())
    ); // Filter movie titles by user input

    setFiltered(results.slice(0, 6)); // limit to 6 items to avoid a huge dropdown
    setShowDropdown(true);
  }, [search, allMovies]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    background: "#e9ecef",
    padding: "20px",
    borderRadius: "12px",
  };

  const headerRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
  };

  const viewAllStyle: React.CSSProperties = {
    color: "#007bff",
    cursor: "pointer",
    fontSize: "16px",
  };

  const moviesRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    marginTop: "20px",
  };

  return (
    <div style={pageStyle}>
      {/* SEARCH BAR WITH DROPDOWN */}
      <div ref={searchRef} style={{ width: "100%", maxWidth: "600px", position: "relative" }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        {/* DROPDOWN */}
        {showDropdown && filtered.length > 0 && (
          <div
            style={{
              position: "absolute",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginTop: "4px",
              width: "100%",
              zIndex: 10,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {filtered.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/movie/${m.id}`)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f1f1",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  style={{ width: "40px", height: "60px", borderRadius: "4px" }}
                />
                {m.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CURRENT MOVIES */}
      <div style={sectionStyle}>
        <div style={headerRow}>
          <h1 style={titleStyle}>Current Movies</h1>
          <span style={viewAllStyle} onClick={() => navigate("/current")}>
            View All
          </span>
        </div>

        <div style={moviesRowStyle}>
          {currentMovies.map((m) => (
            <MovieCard movie={m} key={m.id} />
          ))}
        </div>
      </div>

      {/* UPCOMING MOVIES */}
      <div style={sectionStyle}>
        <div style={headerRow}>
          <h1 style={titleStyle}>Upcoming Movies</h1>
          <span style={viewAllStyle} onClick={() => navigate("/upcoming")}>
            View All
          </span>
        </div>

        <div style={moviesRowStyle}>
          {upcomingMovies.map((m) => (
            <MovieCard movie={m} key={m.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
