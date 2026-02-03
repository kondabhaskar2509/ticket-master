import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const TicketSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeuser } = useContext(AuthContext);
  const { bookingId } = location.state || {};
  const [fetchedBooking, setFetchedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (bookingId) {
          const response = await fetch(
            `http://localhost:5000/bookings/${bookingId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setFetchedBooking(data);
          } else {
            console.error("Failed to fetch booking:", response.status);
            setFetchedBooking(null);
          }
        } else {
          console.error("No booking ID provided");
          setFetchedBooking(null);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        setFetchedBooking(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="p-8 text-center bg-white text-black rounded-lg">
        Loading ticket details...
      </div>
    );
  }
  if (!fetchedBooking || !fetchedBooking.details) {
    return (
      <div className="p-8 text-center bg-white text-black rounded-lg">
        No ticket details available. Please check your booking or try again.
      </div>
    );
  }

  const amount = fetchedBooking.price;
  const booking_id = fetchedBooking._id || bookingId;

  const handleConfirmEventBooking = async () => {
    setActionLoading(true);
    try {
      const updateRes = await fetch(
        `http://localhost:5000/eventbooking/${booking_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ newstatus: "PAID" }),
        }
      );
      if (!updateRes.ok) throw new Error("Failed to confirm booking");

      await fetch("http://localhost:5000/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: activeuser?.email || localStorage.getItem("activeUser"),
          type: "booking-confirmation",
          booking: fetchedBooking,
        }),
      });
      navigate("/mybookings");
    } catch (err) {
      alert("Payment Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const renderMovieSummary = () => {
    if (!fetchedBooking.details) {
      return <div className="text-red-400">Movie details not available.</div>;
    }
    const { title, theatre, slot, selectedDate, selectedSeats, duration } =
      fetchedBooking.details;
    return (
      <div className="w-full">
        <h3 className="text-2xl font-semibold mb-3 text-black">{title}</h3>
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">Duration:</span>{" "}
            {duration}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">Theatre:</span>{" "}
            {theatre}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">Slot:</span> {slot}
          </p>
          {selectedDate && (
            <p className="text-gray-300 mb-2">
              <span className="font-medium text-gray-200">Date:</span>{" "}
              {selectedDate}
            </p>
          )}
          <div className="mt-3">
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <p className="font-medium text-gray-200">Selected Seats:</p>
              {selectedSeats &&
                selectedSeats.map((seat, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 px-2 py-1 rounded text-sm text-gray-200">
                    {seat}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 mb-4">
          <p className="text-xl font-semibold text-black">
            Total Amount: ₹{amount}
          </p>
          <p className="text-gray-400 text-sm">Booking ID: {booking_id}</p>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-lg font-bold"
          onClick={() => {
            localStorage.setItem("payment_booking_id", booking_id);
            navigate("/payments", { state: { bookingId: booking_id, amount } });
          }}>
          Pay Now
        </button>
      </div>
    );
  };

  const renderEventSummary = () => {
    if (!fetchedBooking.details) {
      return <div className="text-red-400">Event details not available.</div>;
    }
    const { title, city, venue, timeframe, organizer } = fetchedBooking.details;
    return (
      <div className="w-full">
        <h3 className="text-2xl font-semibold mb-3 text-black">{title}</h3>
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">City:</span> {city}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">Venue:</span> {venue}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">Date:</span> {timeframe}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">Organizer:</span>{" "}
            {organizer}
          </p>
        </div>
        <div className="border-t border-gray-700 pt-4 mb-4">
          <p className="text-xl font-semibold text-black">
            Total Amount: ₹{amount}
          </p>
          <p className="text-gray-400 text-sm">Booking ID: {booking_id}</p>
        </div>
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-lg font-bold"
          onClick={handleConfirmEventBooking}
          disabled={actionLoading}>
          {actionLoading ? "Confirming..." : "Confirm Booking"}
        </button>
      </div>
    );
  };

  const renderTrainSummary = () => {
    if (!fetchedBooking.details) {
      return <div className="text-red-400">Train details not available.</div>;
    }
    const {
      trainName,
      trainNumber,
      from,
      to,
      date,
      class: classType,
      seats,
    } = fetchedBooking.details;
    return (
      <div className="w-full">
        <h3 className="text-2xl font-semibold mb-3 text-black">
          {trainName} ({trainNumber})
        </h3>
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">From:</span> {from}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">To:</span> {to}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">Date:</span> {date}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-medium text-gray-200">Class:</span>{" "}
            {classType}
          </p>
          <div className="mt-3">
            <p className="font-medium text-gray-200">Seats:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {seats &&
                seats.map((seat, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 px-2 py-1 rounded text-sm text-white">
                    {seat}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 mb-4">
          <p className="text-xl font-semibold text-black">
            Total Amount: ₹{amount}
          </p>
          <p className="text-gray-400 text-sm">Booking ID: {booking_id}</p>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-lg font-bold"
          onClick={() => {
            localStorage.setItem("payment_booking_id", booking_id);
            navigate("/payments", { state: { bookingId: booking_id, amount } });
          }}>
          Pay Now
        </button>
      </div>
    );
  };

  const renderSummary = () => {
    switch (fetchedBooking.type) {
      case "movie":
        return renderMovieSummary();
      case "event":
        return renderEventSummary();
      case "train":
        return renderTrainSummary();
      default:
        return (
          <div className="text-white">
            <p>Unknown booking type. Please try again.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
              Go Back Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full bg-white text-center max-w-2xl rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-black">Ticket Summary</h2>
        {renderSummary()}
      </div>
    </div>
  );
};

export default TicketSummary;
