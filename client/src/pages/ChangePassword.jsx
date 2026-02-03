import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/env";

const ChangePassword = () => {
  const { email, success, setSuccess, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !newConfirmPassword) {
      setError("All password fields are required");
      return;
    }

    if (newPassword !== newConfirmPassword) {
      setError("New passwords do not match");
      return;
    }

    fetch(API_BASE_URL + "/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        currentPassword, 
        newPassword, 
        newConfirmPassword 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setError("");
          setSuccess("Password changed successfully!");
        } else {
          setError(data.error || "Failed to change password");
          setSuccess("");
        }
      })
      .catch(() => {
        setError("An error occurred. Please try again.");
        setSuccess("");
      });
  };

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-md">
        <h1 className="text-3xl text-[#36a3eb] font-bold text-center mb-8">
          Change Password
        </h1>
        <div>
          <label className="loginlabel">Current Password</label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter current password"
              className="logininput"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
            </button>
          </div>
          <label className="loginlabel mt-4">New Password</label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="logininput"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
            </button>
          </div>
          <label className="loginlabel mt-4">Confirm New Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="logininput"
              required
              value={newConfirmPassword}
              onChange={(e) => setNewConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
            </button>
          </div>
          <button
            onClick={handleChangePassword}
            className="w-full text-blue-500 text-center mt-6 active:scale-95 font-bold"
          >
            Change Password
          </button>
          <div className="w-full h-10 text-[17px]">
            <span className="text-red-500 flex justify-center items-center">{error}</span>
            <span className="text-green-500 flex justify-center items-center">{success}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;