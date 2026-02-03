import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BACKEND } from "../config/env";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const { status, user, activeuser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND}/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch(() => setEvent(null));
  }, [id]);

  React.useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken || status !== "success") {
      alert("Please login to access this page.");
      navigate("/login");
    }
  }, [status, navigate]);

  if (!event) {
    return (
      <div className="text-center text-black p-8">Loading event details...</div>
    );
  }

  const handleBookTicket = async () => {
    if (status != "success") {
      alert("Please login to book tickets.");
      navigate("/login");
      return;
    } else {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          alert("Please login to book tickets.");
          navigate("/login");
          return;
        }

        const userEmail =
          typeof activeuser === "string"
            ? activeuser
            : (activeuser && activeuser.email) ||
              (user && user.email) ||
              localStorage.getItem("activeUser");
        if (!userEmail) {
          alert("User email not found. Please login again.");
          navigate("/login");
          return;
        }

        const bookingData = {
          email: userEmail,
          type: "event",
          details: {
            title: event.title,
            city: event.city,
            venue: event.venue,
            timeframe: event.timeframe,
            organizer: event.organizer,
          },
          price: 0,
          bookingStatus: null,
          date: new Date().toISOString(),
        };

        const response = await fetch(BACKEND + "/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create booking");
        }

        const data = await response.json();

        if (!data.bookingId) {
          throw new Error("Booking ID not received from server");
        }

        navigate("/ticket-summary", {
          state: {
            bookingId: data.bookingId,
          },
        });
      } catch (error) {
        console.error("Error creating booking:", error);
        alert("Error saving booking data: " + error.message);
      }
    }
  };

  return (
    <div className="h-[90vh]  flex flex-col items-center justify-center  p-8">
      <div className="w-450 flex flex-col md:flex-row items-center  rounded-3xl  p-8 gap-12 ">
        <img
          className="w-120 h-180  object-cover rounded-2xl shadow-lg border-4 border-blue-700"
          src={event.poster}
          alt=""
        />

        <div className="flex flex-col gap-10 w-full">
          <h1 className="text-5xl h-20  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-500 to-yellow-400  mb-4">
            {event.title}
          </h1>

          <div>
            <span className="text-3xl font-semibold text-blue-500">City :</span>
            <span className="ml-4 text-2xl text-gray-200">{event.city}</span>
          </div>

          <div>
            <span className="text-3xl font-semibold text-blue-500">Venue:</span>
            <span className="ml-4 text-2xl text-gray-200">{event.venue}</span>
          </div>

          <div>
            <span className="text-3xl font-semibold text-blue-500">
              Time & Date :
            </span>
            <span className="ml-4 text-2xl text-gray-200">
              {event.timeframe}
            </span>
          </div>

          <div>
            <span className="text-3xl font-semibold text-blue-500">
              Organizer :
            </span>
            <span className="ml-4 text-2xl text-gray-200">
              {event.organizer}
            </span>
          </div>

          <div>
            <span className="text-3xl font-semibold text-blue-500">
              Description :
            </span>
            <span className="ml-4 text-2xl text-gray-200">
              {event.description}
            </span>
          </div>
        </div>
      </div>
      <button
        className="mt-12 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-2xl font-bold rounded-full shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200"
        onClick={handleBookTicket}>
        Book Ticket For Free
      </button>
    </div>
  );
};

export default EventDetails;
