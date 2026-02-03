import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { activeuser } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const email = activeuser;

        console.log("Fetching bookings for user:", email);

        if (!email) {
          console.log("No active user email found");
          setBookings([]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/bookings/user/${email}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Error response from bookings API:", response.status);
          setBookings([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Bookings data received:", data.length, "bookings");

        const filteredBookings = data.filter(
          (booking) =>
            booking.bookingStatus === "PAID" ||
            booking.bookingStatus === "FAILED"
        );
        setBookings(filteredBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
        setLoading(false);
      }
    };
    fetchBookings();
  }, [activeuser]);

  const renderBookingDetails = (booking) => {
    const { type, details } = booking;
    if (!details) {
      return <p className="text-red-400">Booking details not available</p>;
    }
    if (type === "movie") {
      return (
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-blue-400">{details.title}</h3>
          <p className="text-black">Theatre: {details.theatre}</p>
          <p className="text-black">Show: {details.slot}</p>
          <p className="text-black">
            Seats: {details.selectedSeats?.join(", ")}
          </p>
        </div>
      );
    } else if (type === "event") {
      return (
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-blue-400">{details.title}</h3>
          <p className="text-black">Venue: {details.venue}</p>
          <p className="text-black">City: {details.city}</p>
          <p className="text-black">Time: {details.timeframe}</p>
        </div>
      );
    } else if (type === "train") {
      return (
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-blue-400">
            {details.trainName} ({details.trainNumber})
          </h3>
          <p className="text-black">
            From: {details.from} - To: {details.to}
          </p>
          <p className="text-black">Date: {details.date}</p>
          <p className="text-black">Class: {details.class}</p>
          <p className="text-black">Seats: {details.seats?.join(", ")}</p>
        </div>
      );
    }
    return <p className="text-black">Booking details not available</p>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white text-black">
        <div className="text-2xl font-bold">Loading bookings...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black">
        <div className="text-2xl font-bold text-red-500 mb-4">{error}</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-6">
            You don't have any bookings yet.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/movies"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Book Movie Tickets
            </Link>
            <Link
              to="/events"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg">
              Book Event Tickets
            </Link>
            <Link
              to="/trains"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
              Book Train Tickets
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg p-6 shadow-lg border border-gray-300 hover:border-blue-500 transition-all text-black">
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    booking.bookingStatus === "PAID"
                      ? "bg-green-200 text-green-900"
                      : booking.bookingStatus === "FAILED"
                      ? "bg-red-200 text-red-900"
                      : "bg-yellow-200 text-yellow-900"
                  }`}>
                  {booking.bookingStatus || "PENDING"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    booking.type === "movie"
                      ? "bg-blue-900 text-blue-200"
                      : booking.type === "event"
                      ? "bg-purple-900 text-purple-200"
                      : "bg-green-900 text-green-200"
                  }`}>
                  {booking.type
                    ? booking.type.charAt(0).toUpperCase() +
                      booking.type.slice(1)
                    : "Unknown"}
                </span>
              </div>
              <div className="mb-2 text-xs text-gray-400">
                Booking ID: {booking._id}
              </div>
              {renderBookingDetails(booking)}
              <div className="mt-4 pt-4 border-t border-gray-700">
                {booking.paymentDate && (
                  <p className="text-black">
                    Payment Date:{" "}
                    {new Date(booking.paymentDate).toLocaleDateString()}
                  </p>
                )}
                {booking.transactionId && (
                  <p className="text-black">
                    Transaction ID: {booking.transactionId}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-black">
                    Booked on:{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xl font-bold text-green-400">
                    ₹ {booking.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
