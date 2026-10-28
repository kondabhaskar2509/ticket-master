import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const { status, activeuser, logout } = useContext(AuthContext);

  const handleNav = (path) => {
    navigate(path);
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <>
      <div
        className={'fixed top-[10vh] h-[90vh] w-[15vw] bg-[#10182b]  border-r border-white-400 shadow-lg'}>

        <div className="flex flex-col  py-2 ">
          <div className="px-4 py-2 pt-6 ">
            <p
              onClick={() => handleNav("/")}
              className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                location === "/" ? "bg-[#36a3eb33]" : "hover:bg-[#36a3eb19]"
              } cursor-pointer mb-1 flex items-center`}>
              Home
            </p>
            <p
              onClick={() => handleNav("/movies")}
              className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                location === "/movies"
                  ? "bg-[#36a3eb33]"
                  : "hover:bg-[#36a3eb19]"
              } cursor-pointer mb-1 flex items-center`}>
              Movies
            </p>
            <p
              onClick={() => handleNav("/events")}
              className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                location === "/events"
                  ? "bg-[#36a3eb33]"
                  : "hover:bg-[#36a3eb19]"
              } cursor-pointer mb-1 flex items-center`}>
              Events
            </p>
            <p
              onClick={() => handleNav("/trains")}
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
                  onClick={() => handleNav("/mybookings")}
                  className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                    location === "/mybookings"
                      ? "bg-[#36a3eb33]"
                      : "hover:bg-[#36a3eb19]"
                  } cursor-pointer mb-1 flex items-center`}>
                  My Bookings
                </p>
                <p
                  onClick={() => handleNav("/transaction-history")}
                  className={`text-white text-[20px] py-2 rounded-md pl-3 ${
                    location === "/transaction-history"
                      ? "bg-[#36a3eb33]"
                      : "hover:bg-[#36a3eb19]"
                  } cursor-pointer mb-1 flex items-center`}>
                  Transaction History
                </p>
                <p
                  onClick={() => handleNav("/profile")}
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
                onClick={() => handleNav("/admin")}
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
