import React, { useState, useContext, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ResetPassword = () => {
  const { success, setSuccess, error, setError } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleResetPassword = async () => {
    
    if (!email) {
      setError("Email field cannot be empty");
      return;
    }

    if (!newPassword || !newConfirmPassword) {
      setError("Password fields cannot be empty");
      return;
    }
    
    if (newPassword !== newConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, newConfirmPassword }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setError("");
            setSuccess("Password reset successful! Redirecting to login...");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          } else {
            setError(data.error || "Failed to reset password");
            setSuccess("");
          }
        })
        .catch(() => {
          setError("An error occurred during password reset. Please try again.");
          setSuccess("");
        });
  }


  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-md">
        <h1 className="text-3xl text-[#36a3eb] font-bold text-center mb-8">
          Reset Password
        </h1>
          <div>
            <label className="loginlabel">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="logininput"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
            <label className="loginlabel mt-4">Confirm Password</label>
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
              onClick={handleResetPassword}
              className="w-full text-blue-500 text-center mt-6 active:scale-95 font-bold"
            >
              Reset Password
            </button>
            <div className="w-full h-10  text-[17px]"  >
              <span className="text-red-500 flex justify-center items-center"> {error}</span>
              <span className="text-green-500 flex justify-center items-center"> {success}</span>
            </div>
          </div>
  
      </div>
    </div>
  );
};

export default ResetPassword;