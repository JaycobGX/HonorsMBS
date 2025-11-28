// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { auth } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import ManageMovies from "./ManageMovies";
import ShowtimesManager from "./ShowtimeManager";
import Reports from "./Reports";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/db";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState<"movies" | "showtimes" | "reports">("movies");

  // --- Inline Styles ---
  const container: React.CSSProperties = {
    padding: 20,
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily: "Arial"
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 18px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold"
  };

  const activeButton: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#0056b3",
  };

  useEffect(() => {
    const check = async () => {
      const u = auth.currentUser;
      if (!u) {
        navigate("/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", u.uid));
      const data = snap.data();
      
      if (!snap.exists() || !data?.isAdmin) {
        alert("Not authorized");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    };

    check();
  }, [navigate]);

  if (!isAdmin) return <div style={{ padding: 20 }}>Checking admin...</div>;

  return (
    <div style={container}>
      <h1 style={{ marginBottom: 20 }}>Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div style={navStyle}>
        <button
          style={page === "movies" ? activeButton : buttonStyle}
          onClick={() => setPage("movies")}
        >
          Manage Movies
        </button>

        <button
          style={page === "showtimes" ? activeButton : buttonStyle}
          onClick={() => setPage("showtimes")}
        >
          Manage Showtimes
        </button>

        <button
          style={page === "reports" ? activeButton : buttonStyle}
          onClick={() => setPage("reports")}
        >
          Status Reports
        </button>
      </div>

      {/* Render selected page */}
      {page === "movies" && <ManageMovies />}
      {page === "showtimes" && <ShowtimesManager />}
      {page === "reports" && <Reports />}
    </div>
  );
}
