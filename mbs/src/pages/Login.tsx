import { useState } from "react";
import { login } from "../firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
// Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
// Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset previous error

    try {
      await login(email, password); // Call Firebase login

      // popup
      alert("Login Successful!");

      // navigate home
      navigate("/");

      // simulate refresh after navigation (optional)
      //window.location.reload();

    } catch (err: any) {
      setError(err.message);
    }
  };

  const pageStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "98vw",
    backgroundColor: "#f5f5f5",
  };

  const welcomeStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const boxStyle: React.CSSProperties = {
    width: "320px",
    padding: "24px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "12px",
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const errorStyle: React.CSSProperties = {
    color: "#DC2626",
    fontSize: "12px",
  };

  const registerTextStyle: React.CSSProperties = {
    fontSize: "14px",
    marginTop: "12px",
  };

  const linkStyle: React.CSSProperties = {
    color: "#007BFF",
    fontWeight: "bold",
    textDecoration: "none",
  };

  return (
    <div style={pageStyle}>
      <h1 style={welcomeStyle}>Welcome to MBS</h1>

      <div style={boxStyle}>
        <h1 style={titleStyle}>Login</h1>

        <form onSubmit={handleLogin} style={formStyle}>
          <input
            style={inputStyle}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={buttonStyle}>Login</button>

          {error && <p style={errorStyle}>{error}</p>}
        </form>

        <p style={registerTextStyle}>
          New here?{" "}
          <Link to="/register" style={linkStyle}>
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
