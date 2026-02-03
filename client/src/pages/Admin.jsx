import React, { useState } from "react";
import MoviesAdd from "./admin-components/MoviesAdd";
import MoviesDelete from "./admin-components/MoviesDelete";
import EventsAdd from "./admin-components/EventsAdd";
import EventsDelete from "./admin-components/EventsDelete";
import AllBookings from "./admin-components/AllBookings";
import AllPayments from "./admin-components/AllPayments";

const Admin = () => {
  const [activeComponent, setActiveComponent] = useState("");

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <button
          onClick={() =>
            setActiveComponent(activeComponent === "addMovie" ? "" : "addMovie")
          }
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Add Movie
        </button>
        <button
          onClick={() =>
            setActiveComponent(
              activeComponent === "deleteMovie" ? "" : "deleteMovie"
            )
          }
          className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition">
          Delete Movies
        </button>
        <button
          onClick={() =>
            setActiveComponent(activeComponent === "addEvent" ? "" : "addEvent")
          }
          className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition">
          Add Event
        </button>
        <button
          onClick={() =>
            setActiveComponent(
              activeComponent === "deleteEvent" ? "" : "deleteEvent"
            )
          }
          className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition">
          Delete Events
        </button>
        <button
          onClick={() =>
            setActiveComponent(
              activeComponent === "allBookings" ? "" : "allBookings"
            )
          }
          className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
          All Bookings
        </button>
        <button
          onClick={() =>
            setActiveComponent(
              activeComponent === "allPayments" ? "" : "allPayments"
            )
          }
          className="px-6 py-3 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition">
          All Payments
        </button>
      </div>
      {activeComponent === "addMovie" && (<MoviesAdd onMovieAdded={() => setActiveComponent("")} />)}
      {activeComponent === "deleteMovie" && <MoviesDelete />}
      {activeComponent === "addEvent" && (<EventsAdd onEventAdded={() => setActiveComponent("")} />)}
      {activeComponent === "deleteEvent" && <EventsDelete />}
      {activeComponent === "allBookings" && <AllBookings />}
      {activeComponent === "allPayments" && <AllPayments />}
    </div>
  );
};

export default Admin;
