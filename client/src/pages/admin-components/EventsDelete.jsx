import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/env";

const EventsDelete = () => {
  const [eventdata, setEventdata] = useState([]);

  useEffect(() => {
    fetch(API_BASE_URL + "/events")
      .then((res) => res.json())
      .then((data) => setEventdata(data))
      .catch(() => setEventdata([]));
  }, []);

  const handleDeleteEvent = async (index) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const eventId = eventdata[index].id;
      try {
        const response = await fetch(
          `${API_BASE_URL}/events/${eventId}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          const updatedEvents = eventdata.filter((_, i) => i !== index);
          setEventdata(updatedEvents);
          alert("Event deleted.");
        } else {
          alert("Failed to delete event.");
        }
      } catch {
        alert("Failed to delete event.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-8">
      <h2 className="text-xl font-bold mb-2 text-black">Events</h2>
      <ul>
        {eventdata.map((event, idx) => (
          <li
            key={event.id}
            className="flex justify-between items-center border-b py-2">
            <span className="text-black">{event.title}</span>
            <button
              onClick={() => handleDeleteEvent(idx)}
              className="bg-red-500 text-white px-3 py-1 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsDelete;
