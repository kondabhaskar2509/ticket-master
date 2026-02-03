import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const daySymbols = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function getDaySymbol(date) {
  if (!date) return null;
  return daySymbols[date.getDay()];
}

const Trains = () => {
  const [traindata, setTraindata] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [date, setDate] = useState(new Date());
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const { status } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.BACKEND + "/trains")
      .then((res) => res.json())
      .then((data) => {
        setTraindata(data);
        const stationSet = new Set();
        data.forEach((train) => {
          train.stations.forEach((station) => {
            const entry = `${station.stationName}-${station.stationCode}`;
            stationSet.add(entry);
          });
        });
        setStationList(Array.from(stationSet).sort());
      })
      .catch(() => {
        setTraindata([]);
        setStationList([]);
      });
  }, []);

  const isValidStation = (value) => stationList.includes(value);

  const handleFromInput = (e) => {
    const value = e.target.value;
    setFromInput(value);
    if (value.length > 0) {
      const filtered = stationList.filter((station) => {
        const [name, code] = station.split("-");
        return (
          name.toLowerCase().startsWith(value.toLowerCase()) ||
          code.toLowerCase().startsWith(value.toLowerCase())
        );
      });
      setFromSuggestions(filtered);
      setShowFromSuggestions(true);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  const handleToInput = (e) => {
    const value = e.target.value;
    setToInput(value);
    if (value.length > 0) {
      const filtered = stationList.filter((station) => {
        const [name, code] = station.split("-");
        return (
          name.toLowerCase().startsWith(value.toLowerCase()) ||
          code.toLowerCase().startsWith(value.toLowerCase())
        );
      });
      setToSuggestions(filtered);
      setShowToSuggestions(true);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  const handleFromSelect = (station) => {
    setFromStation(station);
    setFromInput(station);
    setShowFromSuggestions(false);
  };
  const handleToSelect = (station) => {
    setToStation(station);
    setToInput(station);
    setShowToSuggestions(false);
  };

  const handleFromBlur = () => {
    setTimeout(() => {
      if (!isValidStation(fromInput)) {
        setFromInput("");
        setFromStation("");
      }
      setShowFromSuggestions(false);
    }, 100);
  };
  const handleToBlur = () => {
    setTimeout(() => {
      if (!isValidStation(toInput)) {
        setToInput("");
        setToStation("");
      }
      setShowToSuggestions(false);
    }, 100);
  };

  const handleReverse = () => {
    const prevFrom = fromStation;
    const prevTo = toStation;
    setFromStation(prevTo);
    setToStation(prevFrom);
    setFromInput(prevTo);
    setToInput(prevFrom);
    setShowFromSuggestions(false);
    setShowToSuggestions(false);
  };

  const handleSearch = () => {
    if (!fromStation || !toStation) {
      alert("Please select From and To stations.");
      return;
    }
    if (!date || isNaN(date.getTime())) {
      alert("Please select a valid Date.");
      return;
    }
    if (fromStation === toStation) {
      alert("From and To stations cannot be the same.");
      return;
    }
    const fromCode = fromStation.split("-")[1];
    const toCode = toStation.split("-")[1];
    const daySymbol = getDaySymbol(date);

    const trains = traindata.filter((train) => {
      const fromObj = train.stations.find((s) => s.stationCode === fromCode);
      const toObj = train.stations.find((s) => s.stationCode === toCode);
      if (
        !fromObj ||
        !toObj ||
        fromObj.sequence >= toObj.sequence ||
        !train.daysOfOperation.includes(daySymbol)
      ) {
        return false;
      }
      return true;
    });

    navigate("/train-details", {
      state: { trains, fromStation, toStation, date },
    });
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">

      <div className="w-full z-30 bg-transparent h-[10vh] flex items-center justify-center">
        <h1 className="text-6xl font-extrabold text-center text-blue-700 pt-6 tracking-tight">
          Train Booking
        </h1>
      </div>

      <div className="w-full flex items-center justify-center py-6">
        <div className="flex flex-wrap items-center justify-center gap-5 w-full max-w-4xl">
          <div className="relative">
            <input
              type="text"
              placeholder="From Station"
              className="border w-56 h-12 rounded-2xl p-3 m-2 bg-white text-black text-lg"
              value={fromInput}
              onChange={handleFromInput}
              onFocus={() => setShowFromSuggestions(true)}
              onBlur={handleFromBlur}
              autoComplete="off"
            />
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-md w-full max-h-48 overflow-y-auto shadow-lg">
                {fromSuggestions.map((station) => (
                  <li
                    key={station}
                    className="px-3 py-2 text-black active:bg-blue-200 cursor-pointer transition-all"
                    onMouseDown={() => handleFromSelect(station)}>
                    {station}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-200 active:scale-90 transition-all"
            title="Reverse From/To"
            onClick={handleReverse}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 7h10M7 7l3-3M7 7l3 3"
                stroke="#1e3a8a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 17H7M17 17l-3 3M17 17l-3-3"
                stroke="#1e3a8a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="To Station"
              className="border w-56 h-12 rounded-2xl p-3 m-2 bg-white text-black text-lg"
              value={toInput}
              onChange={handleToInput}
              onFocus={() => setShowToSuggestions(true)}
              onBlur={handleToBlur}
              autoComplete="off"
            />
            {showToSuggestions && toSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-md w-full max-h-48 overflow-y-auto shadow-lg">
                {toSuggestions.map((station) => (
                  <li
                    key={station}
                    className="px-3 py-2 text-black active:bg-blue-200 cursor-pointer transition-all"
                    onMouseDown={() => handleToSelect(station)}>
                    {station}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="date"
            className="border w-44 h-12 rounded-2xl p-3 bg-white text-black text-lg"
            min={new Date().toISOString().split("T")[0]}
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const selectedDate = e.target.value
                ? new Date(e.target.value)
                : null;
              setDate(selectedDate);
            }}
          />

          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Search Trains
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Trains;
