import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Movies from "./pages/Movies";
import Trains from "./pages/Trains";
import Events from "./pages/Events";
import MovieDetails from "./pages/MovieDetails";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import DAuthCallback from "./pages/DAuthCallback";
import MovieTheatres from "./pages/MovieTheatres";
import TheatreSeats from "./pages/TheatreSeats";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import TicketSummary from "./pages/TicketSummary";
import TrainDetails from "./pages/TrainDetails";
import Admin from "./pages/Admin";
import TransactionHistory from "./pages/TransactionHistory";
import Payments from "./pages/Payments";
import TrainTicket from "./pages/TrainTicket";
import PaymentStatus from "./pages/PaymentStatus";
import Sidebar from "./components/Sidebar";
import MyAuthCallback from "./pages/MyAuthCallback";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div>
        <Header onClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          {sidebarOpen && <Sidebar />}
          <div className={sidebarOpen ? "w-[85vw]" : "w-full"}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/train-details" element={<TrainDetails />} />
              <Route path="/train-ticket" element={<TrainTicket />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<DAuthCallback />} />
              <Route path="/myauthsignin" element={<MyAuthCallback />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/mybookings" element={<MyBookings />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/trains" element={<Trains />} />
              <Route path="/events" element={<Events />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/movie-theatres" element={<MovieTheatres />} />
              <Route path="/theatre-seats" element={<TheatreSeats />} />
              <Route path="/ticket-summary" element={<TicketSummary />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/transaction-history"
                element={<TransactionHistory />}
              />
              <Route path="/payments" element={<Payments />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
