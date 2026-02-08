import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const DAUTH_CLIENT_ID = "8c6Bna.YrZM1M8GC";
const DAUTH_REDIRECT_URI = process.env.FRONTEND + "/signin";
const DAUTH_SCOPE = "email openid profile user";
const DAUTH_AUTH_URL = "https://auth.delta.nitt.edu/authorize";


function generateRandomString(length = 16) {
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

const MYAUTH_CLIENT_ID = "gT5wdhLxMsluJ8cP";
const MYAUTH_REDIRECT_URI = `${process.env.FRONTEND}/myauthsignin`;
const myauthUrl = process.env.MYAUTH_SERVER + `/authorize?client_id=${MYAUTH_CLIENT_ID}&redirect_uri=${MYAUTH_REDIRECT_URI}`;

const Login = () => {
  React.useEffect(() => {
    setError("");
    setSuccess("");
  }, []);
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    success,
    setSuccess,
    setStatus,
    setActiveuser,
    setToken,
    setUser,
  } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = () => {
    setError("");
    setSuccess("");
    fetch(process.env.BACKEND + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setError("");
          setSuccess("Login Successful");
          setStatus("success");
          setActiveuser(data.user.email);
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("activeUser", data.user.email);
            setToken(data.token);
          }
          setTimeout(() => {
            navigate("/profile");
          }, 1000);
        }
      });
  };

  return (
    <div className="h-[90vh] flex items-center justify-center ">
      <div className="bg-white  rounded-2xl shadow-xl p-10 flex flex-col gap-5 w-md ">
        <h1 className="text-3xl text-[#36a3eb] font-bold text-center ">
          Login{" "}
        </h1>

        <div className="w-full h-10 text-center text-[17px]">
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
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

        <div className="flex justify-end">
          <a
            onClick={() => navigate("/forgot-password")}
            className="text-blue-500 hover:underline cursor-pointer text-sm font-medium">
            Forgot password?
          </a>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md text-lg transition">
          Login
        </button>

        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-400 font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-between">
          <button
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 m-1 rounded-md text-lg transition"
            onClick={() => {
              window.location.href = dauthUrl;
            }}>
            Signin with DAuth
          </button>
          <button
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 m-1 rounded-md text-lg transition"
            onClick={() => {
              window.location.href = myauthUrl;
            }}>
            Signin with MyAuth
          </button>
        </div>

        <button
          type="button"
          className="w-full mt-2  text-blue-600 font-semibold py-3 rounded-md text-xl transition"
          onClick={() => navigate("/signup")}>
          Don't have an account?{" "}
          <span
            className="text-gray-400 cursor-pointer hover:text-black"
            onClick={() => navigate("/signup")}>
            Signup
          </span>
        </button>
      </div>
    </div>
  );
};

export default Login;
