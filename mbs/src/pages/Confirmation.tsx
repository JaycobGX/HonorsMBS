import { useNavigate, useLocation } from "react-router-dom";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

// pulls the booking details passed in from the payment page and in case
// if nothing was sent, fall back to an empty object so the app doesn't break.
  const bookingData = location.state || {};
  const { movieTitle, theater, showtime, seats, totalCost } = bookingData;

//the main outer container styling for full-screen centered layout
  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "24px",
    textAlign: "center",
  };
// card wrapper that holds all confirmation text and actions
  const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "480px",
    width: "100%",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 20px",
    margin: "10px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  };

// Button that sends the user back to the homepage
  const homeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#2563eb",
    color: "white",
  };

  const ticketsButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#10b981",
    color: "white",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Booking Confirmed!
        </h1>

        <p style={{ fontSize: "16px", marginBottom: "16px" }}>
          {movieTitle && <span><strong>Movie:</strong> {movieTitle}<br /></span>}
          {theater && <span><strong>Theater:</strong> {theater}<br /></span>}
          {showtime && <span><strong>Showtime:</strong> {showtime}<br /></span>}
          {seats && <span><strong>Seats:</strong> {seats}<br /></span>}
          {totalCost && <span><strong>Total Paid:</strong> ${totalCost.toFixed(2)}</span>}
        </p>

        <div>
          <button
            style={homeButtonStyle}
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>

          <button
            style={ticketsButtonStyle}
            onClick={() => navigate("/profile")}
          >
            View Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
