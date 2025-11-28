import { Link } from "react-router-dom";
import { auth, logout, getUserData } from "../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then((data: any) => {
        setIsAdmin(!!data?.isAdmin);
      });
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const navStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#000",
    color: "#fff",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
  };

  const linkContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  };

  const linkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    padding: "6px 12px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#fff",
  };

  const loginButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#007BFF",
  };

  const logoutButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#DC2626",
  };

  return (
    <nav style={navStyle}>
      <h1 style={logoStyle}>MBS</h1>

      <div style={linkContainerStyle}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        <Link to="/current" style={linkStyle}>
          Current Movies
        </Link>
        <Link to="/upcoming" style={linkStyle}>
          Upcoming
        </Link>

        {user && isAdmin && (
          <Link to="/admin" style={linkStyle}>
            Admin Dashboard
          </Link>
        )}

        {user ? (
          <>
            <Link to="/profile" style={linkStyle}>
              Profile
            </Link>
            <button onClick={logout} style={logoutButtonStyle}>
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" style={loginButtonStyle}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
