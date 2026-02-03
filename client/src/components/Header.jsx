import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";

const Header = ({onClick}) => {
  const navigate = useNavigate();
  const { status, logout } = useContext(AuthContext);

  return (
    <>

      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-[10vh] flex justify-between items-center px-10 bg-[#10182b]">
          <div className="flex items-center">
            <button
              onClick={onClick}
              className="mr-4 focus:outline-none group">
              <span className="block w-8 h-1 bg-[#36a3eb] mb-1 rounded group-hover:bg-blue-400 transition"></span>
              <span className="block w-8 h-1 bg-[#36a3eb] mb-1 rounded group-hover:bg-blue-400 transition"></span>
              <span className="block w-8 h-1 bg-[#36a3eb] rounded group-hover:bg-blue-400 transition"></span>
            </button>
            <p className="text-[#36a3eb] font-bold text-[50px]">
             Ticket Master
            </p>
          </div>
          <div className="flex gap-8 justify-between items-center text-[25px]">

            <p
              onClick={() => navigate("/")}
              className="text-white rounded-2xl hover:bg-[#86cfff90] p-2 pt-1 cursor-pointer">
              Home
            </p>

            <p
              hidden={status == "success"}
              onClick={() => navigate("/login")}
              className="text-white rounded-2xl hover:bg-[#86cfff90] p-2 pt-1 cursor-pointer">
              Login
            </p>
            <p
              hidden={status == "success"}
              onClick={() => navigate("/signup")}
              className="text-white rounded-2xl hover:bg-[#86cfff90] p-2 pt-1 cursor-pointer">
              Signup
            </p>
            <p
              hidden={status != "success"}
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-white rounded-2xl hover:bg-[#ff4d4d] p-2 pt-1 cursor-pointer">
              Sign Out
            </p>

          </div>
        </div>
        <hr className="border-amber-400 m-0" />
      </div>
      <div className="h-[10vh]" />
    </>
  );
};

export default Header;
