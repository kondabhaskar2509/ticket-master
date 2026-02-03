import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config/env";

const categories = [
  { name: "Recliner", startRow: 0, endRow: 1, price: 250 },
  { name: "Balcony", startRow: 3, endRow: 8, price: 180 },
  { name: "Lower Class", startRow: 10, endRow: 15, price: 130 },
];

const getSeatCategory = (row) => {
  for (const category of categories) {
    if (row >= category.startRow && row <= category.endRow) {
      return category.name;
    }
  }
  return null;
};

const rows = 16;
const cols = 12;
const rowLabels = Array.from({ length: rows }, (_, i) =>
  String.fromCharCode(65 + i)
);
const colLabels = Array.from({ length: cols }, (_, i) => (i + 1).toString());

const seatBoxClass =
  "w-8 h-8 sm:w-6 sm:h-6 m-0.5 rounded shadow text-xs font-bold flex items-center justify-center";
const labelBoxClass =
  "w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-gray-700";

const Seats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movieDetails, selectedTheatre, selectedSlot, bookingType } =
    location.state || {};

  const [seatStatus, setSeatStatus] = useState(() => {
    const status = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seatKey = `${r}-${c}`;
        if (getSeatCategory(r)) {
          status[seatKey] = Math.random() < 0.2 ? "booked" : "available";
        }
      }
    }
    return status;
  });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({
    Recliner: 0,
    Balcony: 0,
    "Lower Class": 0,
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const newSelectedCategories = { Recliner: 0, Balcony: 0, "Lower Class": 0 };
    let newTotalPrice = 0;
    selectedSeats.forEach((seatKey) => {
      const [row] = seatKey.split("-").map(Number);
      const category = getSeatCategory(row);
      if (category) {
        newSelectedCategories[category]++;
        const categoryPrice = categories.find(
          (cat) => cat.name === category
        ).price;
        newTotalPrice += categoryPrice;
      }
    });
    setSelectedCategories(newSelectedCategories);
    setTotalPrice(newTotalPrice);
  }, [selectedSeats]);

  // Booking logic (same as before)
  const createBooking = async () => {
    try {
      const bookingData = {
        userId: localStorage.getItem("activeUser"),
        type: bookingType || "movie",
        details: {
          movie: movieDetails,
          selectedSeats,
          theatre: selectedTheatre,
          slot: selectedSlot,
        },
        price: totalPrice,
        status: "pending",
      };
      const response = await fetch(API_BASE_URL + "/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) throw new Error("Failed to create booking");
      const data = await response.json();
      return data.bookingId;
    } catch (error) {
      console.error("Error in createBooking:", error);
      throw error;
    }
  };

  const toggleSeat = (seatKey) => {
    if (seatStatus[seatKey] === "booked") return;
    if (selectedSeats.includes(seatKey)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatKey));
      setSeatStatus((prev) => ({ ...prev, [seatKey]: "available" }));
    } else {
      setSelectedSeats([...selectedSeats, seatKey]);
      setSeatStatus((prev) => ({ ...prev, [seatKey]: "selected" }));
    }
  };

  const renderLegend = () => (
    <div className="flex justify-center my-5 gap-4">
      {[
        { type: "available", label: "Available", color: "bg-gray-200" },
        { type: "selected", label: "Selected", color: "bg-blue-900" },
        { type: "booked", label: "Booked", color: "bg-red-800" },
      ].map((item) => (
        <div key={item.type} className="flex items-center">
          <div className={`w-5 h-5 mr-1 rounded ${item.color}`}></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );

  const renderCategoryInfo = () => (
    <div className="flex justify-around my-5 flex-wrap gap-4">
      {categories.map((cat) => (
        <div key={cat.name} className="p-3 bg-gray-100 rounded m-1 shadow-sm">
          <strong>{cat.name}</strong>: Rows{" "}
          {String.fromCharCode(65 + cat.startRow)}-
          {String.fromCharCode(65 + cat.endRow)} - ₹{cat.price}
        </div>
      ))}
    </div>
  );

  const renderSeatGrid = () => (
    <div className="w-full flex flex-col items-center">

      <div className="flex ml-10">
        <div className={labelBoxClass} />
        {colLabels.map((col) => (
          <div key={col} className={labelBoxClass}>
            {col}
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center my-2">
        <div className="h-5 bg-gray-300 w-3/5 text-black font-bold flex items-center justify-center rounded-sm shadow-md">
          Screen
        </div>
      </div>

      {rowLabels.map((rowLabel, r) =>
        getSeatCategory(r) ? (
          <div key={rowLabel} className="flex items-center mb-1">

            <div className={labelBoxClass}>{rowLabel}</div>
            {colLabels.map((colLabel, c) => {
              const seatKey = `${r}-${c}`;
              const status = seatStatus[seatKey];
              let seatColor =
                status === "booked"
                  ? "bg-red-800 text-white"
                  : status === "selected"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200 text-black";
              return (
                <button
                  key={seatKey}
                  className={`${seatBoxClass} ${seatColor} ${
                    status === "booked"
                      ? "cursor-not-allowed"
                      : "hover:bg-blue-300"
                  }`}
                  disabled={status === "booked"}
                  onClick={() => toggleSeat(seatKey)}>
                  {rowLabel}
                  {colLabel}
                </button>
              );
            })}
          </div>
        ) : null
      )}

      <div className="flex ml-10 mt-2">
        <div className={labelBoxClass} />
        {colLabels.map((col) => (
          <div key={col} className={labelBoxClass}>
            {col}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto my-8 p-5 bg-white text-black rounded-lg">
      <h2 className="text-center mb-5 text-2xl font-bold">Select Your Seats</h2>
      {renderSeatGrid()}
      {renderLegend()}
      <div className="border-t border-b border-dashed border-gray-300 py-4 my-5">
        {renderCategoryInfo()}
      </div>
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg">
        <div>
          <h3 className="mb-2 text-lg font-bold">Selected Seats Summary</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedCategories).map(
              ([category, count]) =>
                count > 0 && (
                  <div key={category} className="bg-white p-2 rounded">
                    {category}: {count} seats
                  </div>
                )
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-700">Total Amount</div>
          <div className="text-2xl font-bold">₹{totalPrice}</div>
          <button
            className={`mt-2 text-white border-none py-2 px-5 rounded font-bold ${
              selectedSeats.length > 0
                ? "bg-pink-600 cursor-pointer"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={selectedSeats.length === 0}
            onClick={async () => {
              if (selectedSeats.length > 0) {
                try {
                  const bookingId = await createBooking();
                  navigate("/ticket-summary", {
                    state: {
                      bookingDetails: {
                        ...movieDetails,
                        selectedSeats,
                        theatre: selectedTheatre,
                        slot: selectedSlot,
                      },
                      amount: totalPrice,
                      bookingType: bookingType || "movie",
                      bookingId,
                    },
                  });
                } catch (error) {
                  console.error("Error creating booking:", error);
                  alert("Failed to create booking. Please try again.");
                }
              }
            }}>
            Pay ₹{totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Seats;
