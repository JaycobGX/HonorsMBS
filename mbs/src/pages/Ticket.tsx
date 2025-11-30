import { useParams, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function Ticket() {
  const { id } = useParams<{ id: string }>(); // get the booking ID from the URL

  return (
    <div style={{ minHeight: "100vh", width: "98vw", padding: "20px", textAlign: "center" }}>
      <h1>Booking Ticket</h1>
      <p>Booking ID: {id}</p>

      {/* QR Code */}
      <div style={{ margin: "20px auto", width: "200px" }}>
        <QRCodeCanvas value={`https://www.youtube.com/watch?v=dQw4w9WgXcQ`} size={200} />
      </div>

      <p>Scan this QR code at the theater to validate your ticket.</p>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link to="/" style={{ padding: "10px 20px", background: "#007BFF", color: "white", borderRadius: "6px" }}>
          Return to Home
        </Link>
        <button
          onClick={() => window.print()}
          style={{ padding: "10px 20px", background: "#111", color: "white", borderRadius: "6px" }}
        >
          Print Ticket
        </button>
      </div>
    </div>
  );
}
