import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DAUTH_CLIENT_ID = "8c6Bna.YrZM1M8GC";
const DAUTH_REDIRECT_URI = process.env.FRONTEND + "/signin";
const DAUTH_SCOPE = "email openid profile user";
const DAUTH_AUTH_URL = "https://auth.delta.nitt.edu/authorize";

function generateRandomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const state = generateRandomString(12);
const nonce = generateRandomString(12);

const dauthUrl = `${DAUTH_AUTH_URL}?client_id=${encodeURIComponent(
  DAUTH_CLIENT_ID
)}&redirect_uri=${encodeURIComponent(
  DAUTH_REDIRECT_URI
)}&response_type=code&grant_type=authorization_code&scope=${encodeURIComponent(
  DAUTH_SCOPE
)}&state=${state}&nonce=${nonce}`;

const MYAUTH_CLIENT_ID = "eITcLYBVbNw9rYsR"; 
const MYAUTH_REDIRECT_URI = process.env.FRONTEND + "/myauthsignin";
const myauthUrl = `https://myauth-445j.onrender.com/authorize?client_id=${MYAUTH_CLIENT_ID}&redirect_uri=${MYAUTH_REDIRECT_URI}`;

const Signup = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    success,
    setSuccess,

  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password And Confirm Password do not match");
    } else {
      fetch(process.env.BACKEND + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setSuccess("Account Created Successfully");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          } else {
            setError(data.error);
          }
        })
        .catch((err) => setError("Network error: " + err.message));
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center ">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col gap-5 w-full max-w-md">
        <h1 className="text-3xl text-[#36a3eb] font-bold text-center ">
          Signup
        </h1>
        <div className="w-full h-10 text-center text-[17px]">
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
        </div>

        <div>
          <label className="loginlabel ">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="logininput"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
        </div>

        <div>
          <label className="loginlabel">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="logininput"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FaEyeSlash className="text-black" />
              ) : (
                <FaEye className="text-black" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="loginlabel">Confirm Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="logininput"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <FaEyeSlash className="text-black" />
              ) : (
                <FaEye className="text-black" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleSignup}
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md text-lg transition">
          Sign Up
        </button>

        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-400 font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-md text-lg transition"
          onClick={() => {
            window.location.href = dauthUrl;
          }}>
          Signin with DAuth
        </button>

        <button
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-md text-lg transition"
          onClick={() => {
            window.location.href = myauthUrl;
          }}>
          Signin with My Auth
        </button>

        <button
          type="button"
          className="w-full  text-blue-600 font-semibold py-3 rounded-md text-xl transition"
          onClick={() => navigate("/login")}>
          Already have an account?{" "}
          <span
            className="text-gray-400 cursor-pointer hover:text-black"
            onClick={() => navigate("/login")}>
            Login
          </span>
        </button>
      </div>
    </div>
  );
};

export default Signup;
