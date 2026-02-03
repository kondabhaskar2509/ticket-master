import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const TrainDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trains, fromStation, toStation, date } = location.state || {};
  const { status } = useContext(AuthContext);

  if (!trains || trains.length === 0) {
    return (
      <div className="p-8 text-center text-black">
        No trains found for the selected criteria.
      </div>
    );
  }

  const handleBookTicket = (train) => {
    if (status!= "success") {
      alert("Please login to book tickets.");
      navigate("/login");
      return;
    }
    navigate("/train-ticket", {
      state: { train, fromStation, toStation, date },
    });
  };

  return (
    <div className="min-h-screen p-8  text-black w-full rounded-lg flex justify-center">
      <div className="max-w-5xl w-full space-y-6">
        <h2 className="text-4xl font-bold mb-6 text-blue-600 text-center">Train Search Results</h2>
        {trains.map((train) => {
          const fromCode = fromStation.split("-")[1];
          const toCode = toStation.split("-")[1];
          const fromObj = train.stations.find(
            (s) => s.stationCode === fromCode
          );
          const toObj = train.stations.find((s) => s.stationCode === toCode);
          if (!fromObj || !toObj) return null;
          const distance = Math.abs(toObj.distance - fromObj.distance);

          return (
            <div
              key={train.trainNumber}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold text-blue-600">
                  {train.trainName} ({train.trainNumber}) -
                  <span className=" text-blue-600 font-semibold">{train.trainType}</span>
                </h3>
                <button
                  onClick={() => handleBookTicket(train)}
                  className="bg-green-200 text-green-800 px-4 py-2 rounded-xl w-50 hover:bg-green-300 transition"
                >
                  Book Ticket
                </button>
              </div>

              <div className="flex gap-10 text-blue-600 font-semibold mb-4">
                <span>Departure: {fromObj.departureTime || "--"}</span>
                <span>Arrival: {toObj.arrivalTime || "--"}</span>
                <span>Days: {train.daysOfOperation.join(", ")}</span>
                <span>Distance: {distance} km</span>
              </div>

              <div className="flex flex-wrap gap-4">
                {train.classes.map((cls) => {
                  const fare = (cls.farePerKm * distance).toFixed(2);
                  return (
                    <div
                      key={cls.classType}
                      className="bg-purple-100 text-purple-800 rounded-xl px-4 py-2 gap-3 flex items-center  min-w-[140px] cursor-pointer hover:bg-purple-200 transition"
                    >
                      <span className="font-semibold">{cls.classType}</span>
                      <span className="font-semibold ">Fare:</span> ₹{fare}
                    </div>
                  );
                })}
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainDetails;
