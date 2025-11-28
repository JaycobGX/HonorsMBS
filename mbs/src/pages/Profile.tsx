import { useEffect, useState } from "react";
import { auth } from "../firebase/auth";
import { db } from "../firebase/db";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

type Booking = {
  id: string;
  movieId: string;
  theater: string;
  showtime: string;
  seats: number;
  movieTitle?: string;
  posterUrl?: string;
};

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const uid = auth.currentUser?.uid;
  const email = auth.currentUser?.email || "";

  useEffect(() => {
    if (!uid) return;

    const fetchProfile = async () => {
      try {
        // Fetch user info
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUserData(userSnap.data());

        // Fetch bookings from top-level collection
        const bookingQuery = query(
          collection(db, "bookings"),
          where("userId", "==", uid)
        );
        const bookingSnap = await getDocs(bookingQuery);

        const bookingList: Booking[] = [];
        for (const b of bookingSnap.docs) {
          const bookingData = b.data() as Booking;

          // Fetch movie data
          if (bookingData.movieId) {
            const movieSnap = await getDoc(doc(db, "movies", bookingData.movieId));
            if (movieSnap.exists()) {
              const movieData = movieSnap.data();
              bookingData.movieTitle = movieData.title;
              bookingData.posterUrl = movieData.posterUrl;
            }
          }

          bookingList.push({ ...bookingData, id: b.id });
        }

        setBookings(bookingList);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uid]);

  if (loading) return <p>Loading...</p>;

  const updateProfile = async () => {
    if (!uid) return;
    try {
      await updateDoc(doc(db, "users", uid), userData);
      alert("Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const pageStyle: React.CSSProperties = {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
  };

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  };

  return (
    <div style={pageStyle}>
      <h1>My Profile</h1>

      {/* USER INFO */}
      <div style={sectionStyle}>
        <h2>Your Information</h2>

        <label>Full Name</label>
        <input
          style={inputStyle}
          value={userData?.fullName || ""}
          onChange={(e) =>
            setUserData({ ...userData, fullName: e.target.value })
          }
          placeholder="Full Name"
        />

        <label>Email (cannot be changed)</label>
        <input style={inputStyle} value={email} disabled placeholder="Email" />

        <label>Phone Number</label>
        <input
          style={inputStyle}
          value={userData?.phone || ""}
          onChange={(e) =>
            setUserData({ ...userData, phone: e.target.value })
          }
          placeholder="Phone Number"
        />

        <label>Address</label>
        <input
          style={inputStyle}
          value={userData?.address || ""}
          onChange={(e) =>
            setUserData({ ...userData, address: e.target.value })
          }
          placeholder="Address"
        />

        <label>Password (cannot be changed here)</label>
        <input
          style={inputStyle}
          type="password"
          value="********"
          disabled
          placeholder="Password"
        />

        <button
          style={{
            padding: "10px 20px",
            background: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={updateProfile}
        >
          Save Changes
        </button>
      </div>

      {/* BOOKING HISTORY */}
      <div style={sectionStyle}>
        <h2>Booking History</h2>

        {bookings.length === 0 && <p>No bookings found.</p>}

        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
              paddingBottom: "15px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {b.posterUrl && (
              <img
                src={b.posterUrl}
                alt={b.movieTitle}
                style={{ width: "120px", borderRadius: "6px" }}
              />
            )}

            <div>
              <h3>{b.movieTitle || "Unknown Movie"}</h3>
              <p>
                <strong>Theater:</strong> {b.theater}
              </p>
              <p>
                <strong>Showtime:</strong> {b.showtime}
              </p>
              <p>
                <strong>Seats:</strong> {b.seats}
              </p>

              <button
                style={{
                  padding: "8px 16px",
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
                onClick={() => navigate(`/ticket/${b.id}`)}
              >
                View / Print Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link to="/">⬅ Back to Home</Link>
    </div>
  );
}
