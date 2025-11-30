import { useState } from "react";
import { register } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

// called when user submits the registration form
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();  // prevent page reload
    setError(""); // reset any previous errors

    // register and sent to home page
    try {
      await register({ fullName, email, phone, address, password });
      navigate("/");

    } catch (err: any) {
      setError(err.message); // display error message if registration fails
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "98vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    boxSizing: "border-box",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "400px",
    width: "100%",
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px",
    backgroundColor: "#1e90ff",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "12px",
  };

  const errorStyle: React.CSSProperties = {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  };

  return (
    <div style={pageStyle}>
      <form style={containerStyle} onSubmit={handleRegister}>
        <h1 style={titleStyle}>Register</h1>

        <input
          style={inputStyle}
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={buttonStyle} type="submit">
          Register
        </button>

        {error && <p style={errorStyle}>{error}</p>}
      </form>
    </div>
  );
}
