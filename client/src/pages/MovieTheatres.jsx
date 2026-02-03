import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

const theatres = [
  {
    name: "INOX PVP Square",
    location: "PVP Square Mall, MG Road, Vijayawada",
    slots: ["9:00 AM", "12:30 PM", "3:30 PM", "6:00 PM", "9:00 PM"],
  },
  {
    name: "LEPL Icon",
    location: "LEPL Icon, NH16, Vijayawada",
    slots: ["9:00 AM", "12:30 PM", "3:30 PM", "6:00 PM", "9:00 PM"],
  },
  {
    name: "Capital Cinemas",
    location: "Trendset Mall, Benz Circle, Vijayawada",
    slots: ["9:00 AM", "12:30 PM", "3:30 PM", "6:00 PM", "9:00 PM"],
  },
  {
    name: "Swarnam Multiplex",
    location: "Eluru Road, Vijayawada",
    slots: ["9:00 AM", "12:30 PM", "3:30 PM", "6:00 PM", "9:00 PM"],
  },
];

const MovieTheatres = () => {
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const navigate = useNavigate();
  const location = useLocation();
  const { movieDetails, bookingType } = location.state || {};

  const handleTheatreSelect = (theatre) => {
    setSelectedTheatre(theatre);
    setSelectedSlot(null);
  };


  const minDate = getTodayDateString();
  const getFilteredSlots = (slots) => {
    if (selectedDate !== getTodayDateString()) return slots;
    const now = new Date();
    return slots.filter((slot) => {
      const [time, meridian] = slot.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (meridian === "PM" && hours !== 12) hours += 12;
      if (meridian === "AM" && hours === 12) hours = 0;
      const slotDate = new Date(now);
      slotDate.setHours(hours, minutes, 0, 0);
      return slotDate > now;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div
        className={`rounded-2xl shadow-lg p-8 bg-white flex items-center gap-8
          ${selectedTheatre ? "w-[720px]" : "w-[360px]"}
        `}>
          
        <div className="w-72 ">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">
            Select Theatre
          </h2>
          <div className="flex flex-col gap-4 max-h-[600px] ">
            {theatres.map((theatre) => (
              <button
                key={theatre.name}
                className={`w-full py-3  rounded-xl border border-blue-200 bg-blue-50 text-blue-900 font-semibold text-lg hover:bg-blue-100 transition
                  ${
                    selectedTheatre?.name === theatre.name
                      ? "ring-2 ring-blue-600"
                      : ""
                  }
                `}
                onClick={() => handleTheatreSelect(theatre)}>
                <div className="flex flex-col p-5 items-start">
                  <span>{theatre.name}</span>
                  <span className=" text-[13px] text-gray-500">
                    {theatre.location}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedTheatre && (
          <div className="w-72 bg-white rounded-2xl shadow-2xl mt-10 p-6 flex flex-col self-center">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              {selectedTheatre.name}
            </h3>
            <div className="text-base text-gray-600 mb-4">
              {selectedTheatre.location}
            </div>
            <div className="mb-4">
              <div className="text-lg font-semibold text-gray-700 mb-2">
                Select Date:
              </div>
              <input
                type="date"
                className="mb-4 p-2 rounded border border-gray-300 text-black"
                min={minDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <div className="text-lg font-semibold text-gray-700 mb-2">
                Select Slot:
              </div>
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                {getFilteredSlots(selectedTheatre.slots).map((slot) => (
                  <button
                    key={slot}
                    className={`w-full py-2 rounded-xl border ${
                      selectedSlot === slot
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-900 hover:bg-blue-100"
                    } font-semibold text-base transition`}
                    onClick={() => setSelectedSlot(slot)}>
                    {slot}
                  </button>
                ))}
                {getFilteredSlots(selectedTheatre.slots).length === 0 && (
                  <div className="text-gray-400 text-center text-sm">
                    No slots available for the selected date/time.
                  </div>
                )}
              </div>
            </div>

            {selectedSlot && (
              <button
                className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
                onClick={() =>
                  navigate("/theatre-seats", {
                    state: {
                      movieDetails,
                      selectedTheatre,
                      selectedSlot,
                      selectedDate,
                      bookingType,
                    },
                  })
                }>
                Seat Selection
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieTheatres;
