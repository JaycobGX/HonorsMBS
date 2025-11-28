import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/db";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/auth";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state || {};
  console.log("PAYMENT PAGE DATA →", bookingData);

  const { movieTitle, theater, showtime, seats = 1, total } = bookingData;

  const seatCount = Number(seats) || 1;
  const pricePerSeat = total && seatCount ? total / seatCount : 0;
  const totalCost = total || seatCount * pricePerSeat;

  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [venmoUser, setVenmoUser] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to book tickets!");
      return;
    }

    setLoading(true);

    try {
      // Create a new booking in Firestore
      const bookingRef = await addDoc(collection(db, "bookings"), {
        userId: auth.currentUser.uid,
        movieTitle,
        theater,
        showtime,
        seats: seatCount,
        pricePerSeat,
        totalCost,
        paymentMethod: method,
        createdAt: serverTimestamp(),
      });

      console.log("Booking created with ID:", bookingRef.id);

      navigate("/confirmation", {
        state: {
          movieTitle,
          theater,
          showtime,
          seats: seatCount,
          pricePerSeat,
          totalCost,
          paymentMethod: method,
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    background: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    padding: "24px",
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    width: "100%",
    maxWidth: "480px",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #d1d5db",
    padding: "8px",
    borderRadius: "10px",
  };

  const sectionStyle: React.CSSProperties = {
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    marginBottom: "16px",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          Payment
        </h1>

        {/* ORDER SUMMARY */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
            Order Summary
          </h2>
          <p>
            <strong>Movie:</strong> {movieTitle || "NOT RECEIVED"}
          </p>
          <p>
            <strong>Theater:</strong> {theater || "NOT RECEIVED"}
          </p>
          <p>
            <strong>Showtime:</strong> {showtime || "NOT RECEIVED"}
          </p>
          <p>
            <strong>Seats:</strong> {seatCount}
          </p>
          <p>
            <strong>Price per Seat:</strong> ${pricePerSeat.toFixed(2)}
          </p>
          <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "8px" }}>
            Total: ${totalCost.toFixed(2)}
          </p>
        </div>

        {/* PAYMENT METHOD */}
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
          Select Payment Method
        </h2>
        <select
          style={inputStyle}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="card">Credit / Debit Card</option>
          <option value="paypal">PayPal</option>
          <option value="venmo">Venmo</option>
        </select>

        {/* CARD METHOD */}
        {method === "card" && (
          <div style={{ marginTop: "12px", marginBottom: "12px" }}>
            <input
              style={{ ...inputStyle, marginBottom: "10px" }}
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <input
              style={{ ...inputStyle, marginBottom: "10px" }}
              type="text"
              placeholder="MM/YY"
            />
            <input style={inputStyle} type="text" placeholder="CVC" />
          </div>
        )}

        {/* PAYPAL */}
        {method === "paypal" && (
          <input
            style={{ ...inputStyle, marginTop: "12px" }}
            type="email"
            placeholder="PayPal Email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
          />
        )}

        {/* VENMO */}
        {method === "venmo" && (
          <input
            style={{ ...inputStyle, marginTop: "12px" }}
            type="text"
            placeholder="Venmo Username (@username)"
            value={venmoUser}
            onChange={(e) => setVenmoUser(e.target.value)}
          />
        )}

        {/* CONFIRM BUTTON */}
        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            padding: "12px",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}
