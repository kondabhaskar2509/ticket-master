import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const BookTrainTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { train, fromStation, toStation, date } = location.state;
  const { activeuser } = useContext(AuthContext);

  const [selectedClass, setSelectedClass] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setPassengers([]);
    setNewPassenger({ name: "", age: "", gender: "" });
  };

  const handleAddPassenger = () => {
    if (!newPassenger.name || !newPassenger.age || !newPassenger.gender) {
      alert("Please fill all passenger details.");
      return;
    }
    setPassengers([...passengers, newPassenger]);
    setNewPassenger({ name: "", age: "", gender: "" });
  };

  const handleUpdatePassenger = (index, field, value) => {
    if (field === "name") {
      value = value.toUpperCase();
    }
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);
  };

  const handleDeletePassenger = (index) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (field, value) => {
    if (field === "name") {
      value = value.toUpperCase();
    }
    setNewPassenger({ ...newPassenger, [field]: value });
  };

  const handleSubmitBooking = async () => {
    if (!selectedClass) {
      alert("Please select a class.");
      return;
    }
    if (passengers.length === 0) {
      alert("Please add at least one passenger.");
      return;
    }

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
          localStorage.getItem("activeUser");
    if (!userEmail) {
      alert("User email not found. Please login again.");
      navigate("/login");
      return;
    }

    const amount =
      passengers.length *
      Math.round(
        selectedClass.farePerKm *
          (train
            ? Math.abs(
                train.stations.find(
                  (s) => s.stationCode === fromStation.split("-")[1]
                )?.distance -
                  train.stations.find(
                    (s) => s.stationCode === toStation.split("-")[1]
                  )?.distance
              )
            : 0)
      );

    const bookingData = {
      email: userEmail,
      type: "train",
      details: {
        trainName: train.trainName,
        trainNumber: train.trainNumber,
        from: fromStation,
        to: toStation,
        date,
        class: selectedClass.classType,
        seats: passengers.map((p) => `${p.name} (${p.age}, ${p.gender})`),
      },
      price: Number(amount),
      bookingStatus: null,
      link_id: null,
    };

    try {
      const response = await fetch(process.env.BACKEND + "/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save booking data");
      }
      const result = await response.json();

      if (!result.bookingId) {
        throw new Error("Booking ID not received from server");
      }

      navigate("/ticket-summary", { state: { bookingId: result.bookingId } });
    } catch (error) {
      alert("Error saving booking data: " + error.message);
    }
  };

  return (
    <div className="min-h-screen  text-black p-8 flex flex-col items-center">
      <h2 className="text-4xl  font-bold mb-6 text-blue-600">
        Book Train Ticket
      </h2>
      <div className="mb-6 max-w-5xl bg-white p-4 rounded-2xl w-full">
        <h3 className="text-2xl font-semibold mb-2">
          {train?.trainName} ({train?.trainNumber})
        </h3>
        <p className="mb-1">
          From: {fromStation} To: {toStation}
        </p>
        <p className="mb-4">
          Date: {date ? new Date(date).toLocaleDateString() : "N/A"}
        </p>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Select Class:</h4>
          <div className="flex gap-4 flex-wrap">
            {train?.classes.map((cls) => (
              <button
                key={cls.classType}
                className={`px-4 py-2 rounded ${
                  selectedClass === cls
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
                onClick={() => handleClassSelect(cls)}>
                {cls.classType} - ₹
                {Math.round(
                  cls.farePerKm *
                    (train
                      ? Math.abs(
                          train.stations.find(
                            (s) => s.stationCode === fromStation.split("-")[1]
                          )?.distance -
                            train.stations.find(
                              (s) => s.stationCode === toStation.split("-")[1]
                            )?.distance
                        )
                      : 0)
                )}{" "}
                ({cls.totalSeats} seats)
              </button>
            ))}
          </div>
        </div>

        {selectedClass && (
          <>
            <h4 className="font-semibold mb-2">Add Passengers:</h4>
            <div className="space-y-4 mb-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newPassenger.name}
                  onChange={(e) =>
                    handlePassengerChange("name", e.target.value)
                  }
                  className="p-2 rounded text-white bg-gray-600 flex-grow"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={newPassenger.age}
                  onChange={(e) => handlePassengerChange("age", e.target.value)}
                  className="p-2 rounded text-white bg-gray-600 w-20"
                />
                <select
                  value={newPassenger.gender}
                  onChange={(e) =>
                    handlePassengerChange("gender", e.target.value)
                  }
                  className="p-2 rounded text-white bg-gray-600 w-32">
                  <option value="" disabled>
                    Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <button
                  onClick={handleAddPassenger}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition">
                  Add
                </button>
              </div>
              <div>
                {passengers.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-white bg-gray-700 rounded-xl p-3 max-w-md">
                    {passengers.map((p, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span>
                            {p.name} , {p.age} years , {p.gender}
                          </span>
                          <div className="mt-2 flex gap-2 mt-1rounded">
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) =>
                                handleUpdatePassenger(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="p-1 rounded border-1 text-white text-sm w-24"
                              placeholder="Name"
                            />
                            <input
                              type="number"
                              value={p.age}
                              onChange={(e) =>
                                handleUpdatePassenger(
                                  index,
                                  "age",
                                  e.target.value
                                )
                              }
                              className="p-1 rounded border-1 text-white text-sm w-12"
                              placeholder="Age"
                            />
                            <select
                              value={p.gender}
                              onChange={(e) =>
                                handleUpdatePassenger(
                                  index,
                                  "gender",
                                  e.target.value
                                )
                              }
                              className="p-1 rounded border-1 text-white bg-gray-700 text-sm w-20">
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePassenger(index)}
                          className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmitBooking}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Pay Now ₹
              {passengers.length *
                Math.round(
                  selectedClass?.farePerKm *
                    (train
                      ? Math.abs(
                          train.stations.find(
                            (s) => s.stationCode === fromStation.split("-")[1]
                          )?.distance -
                            train.stations.find(
                              (s) => s.stationCode === toStation.split("-")[1]
                            )?.distance
                        )
                      : 0)
                )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookTrainTicket;
