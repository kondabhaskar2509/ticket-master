import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DAuthCallback = () => {
  const { setError, setSuccess, setStatus, setUser, setActiveuser, setToken } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const state = queryParams.get("state");
    
    if (code) {
      setError("");
      setSuccess("");
      fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setUser(data.user);
            setStatus("success");
            setActiveuser(data.user.email);
            localStorage.setItem("user", JSON.stringify(data.user));
            if (data.token) {
              localStorage.setItem("authToken", data.token);
              setToken(data.token);
            }
            navigate("/profile");
          } else {
            setError(data.error || "DAuth login failed");
          }
        });
    }
  }, [
    location.search,
    navigate,
    setActiveuser,
    setError,
    setStatus,
    setSuccess,
    setToken,
    setUser,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182b]">
      <div className="w-full max-w-md bg-white text-black rounded-lg shadow-lg flex flex-col items-center p-10">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-extrabold mb-4 text-black text-center">
          DAuth login successful.
          <br />
          Redirecting to your app...
        </h2>
      </div>
    </div>
  );
};

export default DAuthCallback;
