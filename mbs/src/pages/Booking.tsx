import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/db";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// a single showtime entry from Firestore
type Showtime = {
  id: string;
  movie_id: string;
  theater: string;
  start_time: string;
  ticket_price: number;
};

export default function BookingPage() {
  const { id } = useParams<{ id: string }>(); // movie ID from the URL
  const navigate = useNavigate();

  const [movieTitle, setMovieTitle] = useState(""); // Movie title that is displayed at the top
  const [showtimes, setShowtimes] = useState<Showtime[]>([]); // All available showtimes for this movie
  // User selections
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    if (!id) return;

    // Fetch movie and showtimes when the page loads
    const fetchMovie = async () => {
      const snap = await getDoc(doc(db, "movies", id));
      if (snap.exists()) setMovieTitle(snap.data().title);
    };

    // Fetch all showtimes that belong to this movie
    const fetchShowtimes = async () => {
      const q = query(collection(db, "showtimes"), where("movie_id", "==", id));
      const querySnapshot = await getDocs(q);

      const shows: Showtime[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Showtime;
        // pushes each showtime into a clean array
        shows.push({
          id: docSnap.id,
          movie_id: data.movie_id,
          theater: data.theater,
          start_time: data.start_time,
          ticket_price: data.ticket_price,
        });
      });

      setShowtimes(shows);
    };

    fetchMovie();
    fetchShowtimes();
  }, [id]);

  // Change Theater
  const onTheaterChange = (theater: string) => {
    setSelectedTheater(theater);

    // When the theater changes, reset the selected showtime and price
    setSelectedShowtime("");
    setTicketPrice(0);
  };

  // Change Showtime
  const onShowtimeChange = (time: string) => {
    setSelectedShowtime(time);

    const selected = showtimes.find(
      (s) => s.theater === selectedTheater && s.start_time === time
    );

    if (selected) setTicketPrice(selected.ticket_price);
  };
  
// When user clicks "Confirm & Pay", send booking info to Payment page
  const handleConfirm = () => {
    navigate("/payment", {
      state: {
        movieTitle,
        theater: selectedTheater,
        showtime: selectedShowtime,
        seats,
        total: seats * ticketPrice,
      },
    });
  };

  const theaters = [...new Set(showtimes.map((s) => s.theater))];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Booking Tickets for {movieTitle || "Loading..."}
      </h1>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          maxWidth: "500px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Theater */}
        <div>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Select Theater
          </label>
          <select
            value={selectedTheater}
            onChange={(e) => onTheaterChange(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            <option value="">Choose a theater</option>
            {theaters.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Showtime */}
        <div>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Select Showtime
          </label>

          <select
            value={selectedShowtime}
            disabled={!selectedTheater}
            onChange={(e) => onShowtimeChange(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              width: "100%",
              backgroundColor: selectedTheater ? "#fff" : "#eee",
            }}
          >
            <option value="">Choose a showtime</option>
            {showtimes
              .filter((s) => s.theater === selectedTheater)
              .map((s) => (
                <option key={s.id} value={s.start_time}>
                  {s.start_time} — ${s.ticket_price.toFixed(2)}
                </option>
              ))}
          </select>
        </div>

        {/* Seats */}
        <div>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Number of Seats (max 10)
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </div>

        {/* Price */}
        <div style={{ fontWeight: "bold" }}>
          Price per Ticket: ${ticketPrice.toFixed(2)}
        </div>
        <div style={{ fontWeight: "bold", fontSize: "18px" }}>
          Total: ${(ticketPrice * seats).toFixed(2)}
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          disabled={!selectedTheater || !selectedShowtime}
          style={{
            padding: "15px",
            backgroundColor: "#007BFF",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "10px",
            cursor:
              !selectedTheater || !selectedShowtime
                ? "not-allowed"
                : "pointer",
          }}
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}
