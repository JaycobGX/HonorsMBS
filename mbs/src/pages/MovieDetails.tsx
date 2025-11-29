import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/db";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { Movie } from "../types/Movie";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>(); // Get movie ID from URL
  const [movie, setMovie] = useState<Movie | null>(null); // Movie details state
  const [reviews, setReviews] = useState<any[]>([]); // Reviews state
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5); // Controlled input for rating (1-5)
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      const docRef = doc(db, "movies", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMovie({ ...docSnap.data(), id: docSnap.id } as Movie);
      }
    };

    fetchMovie();
  }, [id]);

  // Fetch reviews live using Firestore onSnapshot
  useEffect(() => {
    if (!id) return;

    const reviewsRef = collection(db, "movies", id, "reviews");
// Firestore real-time listener
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const fetched = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setReviews(fetched);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [id]);

  if (!movie) return <p>Loading...</p>; // Show loading if movie data isn't ready
 // Navigate to booking page for this movie
  const handleBookTickets = () => {
    navigate(`/booking/${movie.id}`);
  };
 // Submit a review to Firestore
  const submitReview = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to leave a review.");
      return;
    }

    if (!reviewText.trim()) {
      alert("Review cannot be empty.");
      return;
    }
//add a new review to Firestore under this movie
    await addDoc(collection(db, "movies", movie.id!, "reviews"), {
      user: user.email,
      rating,
      reviewText,
      createdAt: Timestamp.now(),
    });

    setReviewText("");
    setRating(5);
  };

  // Styles
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "98vw",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1000px",
    width: "100%",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const topSection: React.CSSProperties = {
    display: "flex",
    gap: "20px",
  };

  const posterStyle: React.CSSProperties = {
    width: "300px",
    borderRadius: "8px",
  };

  const infoRight: React.CSSProperties = {
    flex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  const infoLine: React.CSSProperties = {
    marginBottom: "8px",
    fontSize: "16px",
  };

  const descStyle: React.CSSProperties = {
    marginTop: "20px",
    fontSize: "16px",
    lineHeight: 1.5,
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "20px",
    padding: "12px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  };

  const reviewBox: React.CSSProperties = {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#fafafa",
    borderRadius: "8px",
  };

  const reviewItem: React.CSSProperties = {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "6px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginTop: "10px",
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>

        {/* TOP SECTION */}
        <div style={topSection}>
          <img src={movie.posterUrl} alt={movie.title} style={posterStyle} />

          <div style={infoRight}>
            <h1 style={titleStyle}>{movie.title}</h1>

            <p style={infoLine}><strong>Genre:</strong> {movie.genre}</p>
            <p style={infoLine}><strong>Cast:</strong> {movie.cast}</p>
            <p style={infoLine}><strong>Duration:</strong> {movie.duration}</p>
            <p style={infoLine}><strong>Status:</strong> {movie.status}</p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p style={descStyle}>{movie.description}</p>

        <button style={buttonStyle} onClick={handleBookTickets}>
          Book Tickets
        </button>

        {/* REVIEW SECTION */}
        <div style={reviewBox}>
          <h2>Reviews</h2>

          <div>
            <label>
              Rating:
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>

            <textarea
              style={{ width: "100%", height: "80px", marginTop: "10px" }}
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button style={buttonStyle} onClick={submitReview}>
              Submit Review
            </button>
          </div>

          {/* DISPLAY REVIEWS */}
          {reviews.map((r) => (
            <div key={r.id} style={reviewItem}>
              <p><strong>{r.user}</strong> — ⭐ {r.rating}</p>
              <p>{r.reviewText}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
