import React, { useEffect, useState } from "react";
import { BACKEND } from "../../config/env";

const AllBookings = () => {
  const [allBookings, setAllBookings] = useState({});
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await fetch(BACKEND + "/bookings/admin/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      const bookingsByUser = {};
      if (Array.isArray(data)) {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filteredData = data.filter(
          (booking) =>
            booking.bookingStatus === "PAID" ||
            booking.bookingStatus === "FAILED"
        );
        filteredData.forEach((booking) => {
          const email = booking.email;
          if (!bookingsByUser[email]) {
            bookingsByUser[email] = [];
          }
          bookingsByUser[email].push(booking);
        });
      }
      setAllBookings(bookingsByUser);
    } catch (err) {
      setAllBookings({});
    } finally {
      setLoadingBookings(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        All User Bookings
      </h2>
      {loadingBookings ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      ) : Object.keys(allBookings).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(allBookings).map(([email, bookings]) => (
            <div
              key={email}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
              <div className="bg-blue-600 text-white px-6 py-4">
                <h3 className="text-xl font-bold">{email}</h3>
                <p className="text-sm opacity-80">{bookings.length} bookings</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-white rounded-lg p-4 shadow border border-gray-300 hover:border-blue-500 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.bookingStatus === "PAID"
                              ? "bg-green-200 text-green-900"
                              : booking.bookingStatus === "FAILED"
                              ? "bg-red-200 text-red-900"
                              : "bg-yellow-200 text-yellow-900"
                          }`}>
                          {booking.bookingStatus || "PENDING"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                      <div className="mb-4">
                        {booking.details && booking.type === "movie" && (
                          <div>
                            <h4 className="text-lg font-semibold text-blue-700">
                              {booking.details.title}
                            </h4>
                            <p className="text-black">
                              Theatre: {booking.details.theatre}
                            </p>
                            <p className="text-black">
                              Show: {booking.details.slot}
                            </p>
                            <p className="text-black">
                              Seats: {booking.details.selectedSeats?.join(", ")}
                            </p>
                          </div>
                        )}
                        {booking.details && booking.type === "event" && (
                          <div>
                            <h4 className="text-lg font-semibold text-purple-700">
                              {booking.details.title}
                            </h4>
                            <p className="text-black">
                              Venue: {booking.details.venue}
                            </p>
                            <p className="text-black">
                              City: {booking.details.city}
                            </p>
                            <p className="text-black">
                              Time: {booking.details.timeframe}
                            </p>
                          </div>
                        )}
                        {booking.details && booking.type === "train" && (
                          <div>
                            <h4 className="text-lg font-semibold text-green-700">
                              {booking.details.trainName} (
                              {booking.details.trainNumber})
                            </h4>
                            <p className="text-black">
                              From: {booking.details.from} - To:{" "}
                              {booking.details.to}
                            </p>
                            <p className="text-black">
                              Date: {booking.details.date}
                            </p>
                            <p className="text-black">
                              Class: {booking.details.class}
                            </p>
                            <p className="text-black">
                              Seats: {booking.details.seats?.join(", ")}
                            </p>
                          </div>
                        )}
                        {!booking.details && (
                          <p className="text-red-500">
                            Booking details not available
                          </p>
                        )}
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        {booking.transactionId && (
                          <p className="text-gray-700 text-sm">
                            Transaction ID: {booking.transactionId}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-gray-700 text-sm">
                            Booked on:{" "}
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xl font-bold text-green-700">
                            ₹ {booking.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBookings;
