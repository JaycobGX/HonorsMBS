//MovieCard.tsx: Displays a movie poster, title, and a button that navigates to the movie's detail page.

import type { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();
//When the user clicks the button, it redirects them to /movie/<id>, which  shows detailed info about the movie.

  const goToDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  const cardStyle: React.CSSProperties = {
    width: "240px",
    border: "1px solid #4c00ffff",
    borderRadius: "8px",
    overflow: "hidden", // Ensuring poster corners follow the card shape
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    margin: "10px", // Spaces out cards when listed
  };

//Forces a consistent size and crops images that don't match
  const posterStyle: React.CSSProperties = {
    width: "100%",
    height: "320px",
    objectFit: "cover",
  };

  const contentStyle: React.CSSProperties = {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "auto",
    padding: "8px 12px",
    backgroundColor: "#ff0000ff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };
// Component layout will be poster on top, title + button beneath.
  return (
    <div style={cardStyle}>
      <img src={movie.posterUrl} alt={movie.title} style={posterStyle} />
      <div style={contentStyle}>
        <h3 style={{ textAlign: "center" , fontWeight: "bold", fontSize: "25px", marginBottom: "10px" , marginTop: "1px"}}>
          {movie.title}
        </h3>
        <button style={buttonStyle} onClick={goToDetails}>
          View Details
        </button>
      </div>
    </div>
  );
}
