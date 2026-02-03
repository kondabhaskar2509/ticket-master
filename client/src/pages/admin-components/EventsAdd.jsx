import React, { useState } from "react";
import { API_BASE_URL } from "../../config/env";

const eventTypes = [
  "Festember Concerts",
  "Nittfest Concerts",
  "Pragyan Concerts",
  "Other College Concerts",
  "Chennai Events",
  "Madurai Events",
  "Tamilnadu Events",
  "Coimbatore Events",
];

const EventsAdd = ({ onEventAdded }) => {
  const [eventFormData, setEventFormData] = useState({
    title: "",
    poster: "",
    city: "",
    venue: "",
    timeframe: "",
    description: "",
    type: "",
    organizer: "",
  });

  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData({ ...eventFormData, [name]: value });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_BASE_URL + "/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventFormData),
      });
      if (response.ok) {
        alert(
          "Event '" + eventFormData.title + "' has been added successfully!"
        );
        setEventFormData({
          title: "",
          poster: "",
          city: "",
          venue: "",
          timeframe: "",
          description: "",
          type: "",
          organizer: "",
        });
        if (onEventAdded) onEventAdded();
      } else {
        alert("Failed to add event.");
      }
    } catch {
      alert("Failed to add event.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">
        Add New Event
      </h2>
      <form onSubmit={handleEventSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Event Title</label>
            <input
              type="text"
              name="title"
              value={eventFormData.title}
              onChange={handleEventInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Enter event title"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Poster URL</label>
            <input
              type="url"
              name="poster"
              value={eventFormData.poster}
              onChange={handleEventInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Enter poster URL"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">City</label>
            <input
              type="text"
              name="city"
              value={eventFormData.city}
              onChange={handleEventInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Enter city"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Venue</label>
            <input
              type="text"
              name="venue"
              value={eventFormData.venue}
              onChange={handleEventInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Enter venue"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Timeframe</label>
            <input
              type="text"
              name="timeframe"
              value={eventFormData.timeframe}
              onChange={handleEventInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Enter timeframe"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Event Type</label>
            <select
              name="type"
              value={eventFormData.type}
              onChange={handleEventInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300">
              <option value="">Select type</option>
              {eventTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Organizer</label>
            <input
              type="text"
              name="organizer"
              value={eventFormData.organizer}
              onChange={handleEventInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Enter organizer"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-blue-700">Event Description</label>
          <textarea
            name="description"
            value={eventFormData.description}
            onChange={handleEventInputChange}
            required
            rows="4"
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
            placeholder="Enter event description"></textarea>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              if (onEventAdded) onEventAdded();
            }}
            className="px-5 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white">
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-green-600 rounded hover:bg-green-700 text-white">
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventsAdd;
