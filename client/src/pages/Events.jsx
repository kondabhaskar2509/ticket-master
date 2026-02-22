import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const events = [
  "Chennai Events",
  "Madurai Events",
  "Tamilnadu Events",
  "Coimbatore Events",
  "Festember Concerts",
  "Nittfest Concerts",
  "Pragyan Concerts",
  "Other College Concerts",
];

const Events = () => {
  const navigate = useNavigate();
  const [eventdata, setEventdata] = useState([]);

  useEffect(() => {
    fetch(process.env.BACKEND + "/events")
      .then((res) => res.json())
      .then((data) => setEventdata(data))
      .catch(() => setEventdata([]));
  }, []);

  return (
    <>
      <h1 className="text-6xl font-extrabold text-center text-blue-700 pt-6 tracking-tight">
        Events Booking
      </h1>

      <div className="flex flex-col justify-center">
          {events.map((event, index) => (
            <div key={index}>
              <h1 className="headingevents">-------{event}-------</h1>
                <div className="flex justify-center">
                  {eventdata
                    .filter((item) => item.type.includes(event))
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
          ))}



      </div>
    </>
  );
};

export default Events;
