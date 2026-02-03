import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();
  return (
<>
      <div className="flex items-center justify-center gap-10 mt-5 p-3 ">
        <button className="button" onClick={() => navigate("/movies")}>
          Movies
        </button>
        <button className="button" onClick={() => navigate("/trains")}>
          Trains
        </button>
        <button className="button" onClick={() => navigate("/events")}>
          Concerts & Events
        </button>
      </div>

  
        <div className=" flex flex-col items-center justify-center  gap-8 p-3 ">
          <h2 className="text-5xl font-semibold text-blue-700 text-center">
            Book Everything, All in One Place!
          </h2>
          <span className="text-4xl text-center text-blue-500 font-bold">
              Welcome to  Ticket Master
          </span>

          <p className="text-3xl text-gray-300 text-center max-w-7xl">
            Your one-stop solution for booking movies,trains and events with
            ease. Discover the latest blockbusters, catch your favorite events,
            or plan your next journey, all from a single, seamless platform.
          </p>
          <p className="text-2xl text-gray-400 text-center max-w-3xl">
            Select a category above to get started. Enjoy a smooth, secure, and
            universal ticketing experience designed just for you!
          </p>
        </div>







</>
)};

export default Home;
