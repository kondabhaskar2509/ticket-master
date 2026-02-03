import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/env";

const ForgotPassword = () => {
  const { email, success, setSuccess, setEmail, error, setError } =
    useContext(AuthContext);

  const handleSendMail = async () => {

      fetch(API_BASE_URL + "/forgot-password-usercheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
        .then((res) => res.json())
        .then((data) => {
    if (data.status === "failure") {
      setError("User does not exist");
    } else{
        setSuccess("")
        setError("Sending...");
        fetch(API_BASE_URL + "/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((data) => {
        if (data.status === "success") { 
        setError("");
        setSuccess("Reset Password Link Sent Succesfully ");
      }
    })
    }
  });
};

  return (
    <div className="h-[90vh] flex items-center justify-center ">
      <div className="bg-white rounded-2xl shadow-xl p-10 ">
        <h1 className="text-3xl text-[#36a3eb] font-bold text-center mb-8">
          Forgot Password
        </h1>
        <div>
          <label className="loginlabel text-center">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="logininput"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSendMail}
            className="w-full text-blue-500 text-center  mt-3 active:scale-95    font-bold  ">
            Send Reset Password Link
          </button>

          <div className="w-full h-10 text-[17px]  ">
            <span className="text-red-500 flex justify-center items-center" > {error}</span>
            <span className="text-green-500 flex justify-center items-center"> {success}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ForgotPassword;
