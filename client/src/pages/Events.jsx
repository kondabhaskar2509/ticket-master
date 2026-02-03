import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND } from "../config/env";

const concerts = [
  "Festember Concerts",
  "Nittfest Concerts",
  "Pragyan Concerts",
  "Other College Concerts",
];
const events = [
  "Chennai Events",
  "Madurai Events",
  "Tamilnadu Events",
  "Coimbatore Events",
];

const Events = () => {
  const navigate = useNavigate();
  const [eventdata, setEventdata] = useState([]);

  useEffect(() => {
    fetch(BACKEND + "/events")
      .then((res) => res.json())
      .then((data) => setEventdata(data))
      .catch(() => setEventdata([]));
  }, []);

  return (
    <>
      <h1 className="text-6xl font-extrabold text-center text-blue-700 pt-6 tracking-tight">
        Concert & Event Booking
      </h1>

      <div className="flex  ">
        <div className="flex flex-col">
          {concerts.map((concert, index) => (
            <div key={index}>
              <h1 className="headingevents">-------{concert}-------</h1>
              <div className="flex w-full ml-20 overflow-auto">
                <div className="flex justify-center">
                  {eventdata
                    .filter((item) => item.type.includes(concert))
                    .map((item, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(`/event/${item.id}`)}
                        className="w-60  m-2  bg-white rounded-xl cursor-pointer">
                        <img
                          className="h-90 w-60 px-2 pt-2 rounded-2xl-70"
                          src={item.poster}
                          alt=""
                        />
                        <p className="text-black font-semibold p-2">
                          {item.title}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col ml-30 ">
          {events.map((event, index) => (
            <div key={index}>
              <h1 className="headingevents">-------{event}-------</h1>
              <div className="flex w-full  ml-20 overflow-auto">
                <div className="flex justify-center">
                  {eventdata
                    .filter((item) => item.type.includes(event))
                    .map((item, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(`/event/${item.id}`)}
                        className="w-60  m-2  bg-white rounded-xl cursor-pointer">
                        <img
                          className="h-90 w-60 px-2 pt-2 rounded-2xl"
                          src={item.poster}
                          alt=""
                        />
                        <p className="text-black font-semibold p-2">
                          {item.title}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Events;
