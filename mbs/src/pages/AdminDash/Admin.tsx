
// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { auth } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import ManageMovies from "./ManageMovies";
import ShowtimesManager from "./ShowtimeManager";
import Reports from "./Reports";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/db";
/**
 * AdminDashboard : Main admin panel that controls access to three management sections:
 * - Manage Movies
 * - Manage Showtimes
 * - Status Reports
 * the access is restricted to authenticated users with `isAdmin = true` in their Firestore user document.
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); //checks if the authenticated user is confirmed as an admin
  const [page, setPage] = useState<"movies" | "showtimes" | "reports">("movies"); //controls which admin section is currently displayed

  // --- Inline Styles ---
  const container: React.CSSProperties = {
    padding: "20px",
    width: "98vw",
    minHeight: "100vh",
    margin: "0 auto",
    fontFamily: "Arial"
  };
  // const pageStyle: React.CSSProperties = {
  //   minHeight: "100vh",
  //   width: "98vw",
  //   padding: "20px",
  //   boxSizing: "border-box",
  //   backgroundColor: "#f5f5f5",
  //   display: "flex",
  //   flexDirection: "column",
  //   alignItems: "center",
  // };
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
 //darker style applied to the tab that is currently active
  const activeButton: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#0056b3",
  };

  useEffect(() => {
    const check = async () => {
      const u = auth.currentUser;
      // if no user logged in then it redirects to login page
      if (!u) {
        navigate("/login");
        return;
      }
      // get user metadata from Firestore
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
