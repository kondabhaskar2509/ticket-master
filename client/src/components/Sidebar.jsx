import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const { status, activeuser, logout } = useContext(AuthContext);
  return (
    <>
      <div
        className={'left-0 top-[10vh] h-auto w-[15vw] bg-[#10182b]  border-r border-amber-400 shadow-lg'}>

        <div className="flex flex-col  py-2 ">
          <div className="px-4 py-2 pt-6 ">
            <p
              onClick={() => {
                navigate("/");
                onClose();
              }}
              className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                location === "/" ? "bg-[#36a3eb33]" : "hover:bg-[#36a3eb19]"
              } cursor-pointer mb-1 flex items-center`}>
              Home
            </p>
            <p
              onClick={() => {
                navigate("/movies");
                onClose();
              }}
              className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                location === "/movies"
                  ? "bg-[#36a3eb33]"
                  : "hover:bg-[#36a3eb19]"
              } cursor-pointer mb-1 flex items-center`}>
              Movies
            </p>
            <p
              onClick={() => {
                navigate("/events");
                onClose();
              }}
              className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                location === "/events"
                  ? "bg-[#36a3eb33]"
                  : "hover:bg-[#36a3eb19]"
              } cursor-pointer mb-1 flex items-center`}>
              Events
            </p>
            <p
              onClick={() => {
                navigate("/trains");
                onClose();
              }}
              className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                location === "/trains"
                  ? "bg-[#36a3eb33]"
                  : "hover:bg-[#36a3eb19]"
              } cursor-pointer mb-1 flex items-center`}>
              Trains
            </p>
            {status === "success" && (
              <>
                <p
                  onClick={() => {
                    navigate("/mybookings");
                    onClose();
                  }}
                  className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                    location === "/mybookings"
                      ? "bg-[#36a3eb33]"
                      : "hover:bg-[#36a3eb19]"
                  } cursor-pointer mb-1 flex items-center`}>
                  My Bookings
                </p>
                <p
                  onClick={() => {
                    navigate("/transaction-history");
                    onClose();
                  }}
                  className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                    location === "/transaction-history"
                      ? "bg-[#36a3eb33]"
                      : "hover:bg-[#36a3eb19]"
                  } cursor-pointer mb-1 flex items-center`}>
                  Transaction History
                </p>
                <p
                  onClick={() => {
                    navigate("/profile");
                    onClose();
                  }}
                  className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                    location === "/profile"
                      ? "bg-[#36a3eb33]"
                      : "hover:bg-[#36a3eb19]"
                  } cursor-pointer mb-1 flex items-center`}>
                  Profile
                </p>
              </>
            )}
            {activeuser === "kondabhaskar2509@gmail.com" && (
              <p
                onClick={() => {
                  navigate("/admin");
                  onClose();
                }}
                className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                  location === "/admin"
                    ? "bg-[#36a3eb33]"
                    : "hover:bg-[#36a3eb19]"
                } cursor-pointer mb-1 flex items-center`}>
                Admin
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );

};

export default Sidebar;
