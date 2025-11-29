// src/pages/admin/Reports.tsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/db";

// Stats
export default function Reports() {
  const [ticketsSold, setTicketsSold] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [playingMovies, setPlayingMovies] = useState<string[]>([]);

  useEffect(() => {
    fetchReport(); // load stats on page load
  }, []);

// get all bookings
  const fetchReport = async () => {
    const snap = await getDocs(collection(db, "bookings"));
    let sold = 0;
    let rev = 0;

// Sum seats + totalCost from each booking document
    snap.docs.forEach((d) => {
      const b: any = d.data();
      sold += Number(b.seats || 0);
      rev += Number(b.totalCost || 0);
    });

    setTicketsSold(sold);
    setRevenue(rev);
//Get all movies with status = "current"
    const msnap = await getDocs(
      query(collection(db, "movies"), where("status", "==", "current"))
    );
    setPlayingMovies(msnap.docs.map((d) => d.data().title)); // Get list of movie titles that are currently playing
  };

  const pageStyle: React.CSSProperties = {
    padding: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  };

  const cardGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const containerStyle: React.CSSProperties = {
    background: "#f3f3f3",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ fontSize: "28px", fontWeight: 600 }}>Status Reports</h2>

      {/* Stats Cards */}
      <div style={cardGrid}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: "32px", margin: 0 }}>{ticketsSold}</h3>
          <p style={{ margin: 0, marginTop: 6, fontSize: "16px" }}>
            Tickets Sold
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: "32px", margin: 0 }}>
            ${revenue.toFixed(2)}
          </h3>
          <p style={{ margin: 0, marginTop: 6, fontSize: "16px" }}>
            Total Revenue
          </p>
        </div>
      </div>

      {/* Upcoming / Current Movies Container */}
      <div style={containerStyle}>
        <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Now Playing</h3>

        {playingMovies.length === 0 ? (
          <p>No movies currently playing.</p>
        ) : (
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            {playingMovies.map((title, index) => (
              <li key={index} style={{ marginBottom: "6px" }}>
                {title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
