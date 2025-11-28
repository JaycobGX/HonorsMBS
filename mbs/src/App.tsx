import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CurrentMovies from "./pages/CurrentMovies";
import UpcomingMovies from "./pages/UpcomingMovies";
import MovieDetails from "./pages/MovieDetails";
import Register from "./pages/Register";
import BookingPage from "./pages/Booking";
import PaymentPage from "./pages/PaymentPage";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDash/Admin";
import ConfirmationPage from "./pages/Confirmation";
import Ticket from "./pages/Ticket";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/current" element={<CurrentMovies />} />
        <Route path="/upcoming" element={<UpcomingMovies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/payment/" element={<PaymentPage />} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/ticket/:id" element={<Ticket />} />
      </Routes>
    </BrowserRouter>
  );
}
