import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BACKEND } from "../config/env";

const Payments = () => {
  const location = useLocation();
  const { bookingId, amount } = location.state || {};
  const { user, activeuser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createPaymentLink = async () => {
    setLoading(true);
    setError("");
    try {
      const userEmail = user?.email || activeuser || "";
      const userName = user?.name || "";
      const response = await fetch(
        `${BACKEND}/create-payment-link?totalAmount=${amount}&email=${userEmail}&username=${userName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        }
      );
      const data = await response.json();
      if (data.link_url && data.link_id) {
        try {
          const userEmail = user?.email || activeuser || "";
          await fetch(BACKEND + "/addpaymentdetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId,
              email: userEmail,
              amount,
              linkId: data.link_id,
            }),
          });
        } catch (err) {
          console.error("Failed to add payment details:", err);
        }

        localStorage.setItem(`payment_link_id_${bookingId}`, data.link_id);
        localStorage.setItem(`payment_link_url_${bookingId}`, data.link_url);

        window.location.href = data.link_url;
      } else {
        setError(data.error || "Failed to create payment link");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    setError("");
    setLoading(true);

    try {
      const linkId = localStorage.getItem(`payment_link_id_${bookingId}`);
      const linkUrl = localStorage.getItem(`payment_link_url_${bookingId}`);

      if (linkId && linkUrl) {
        window.location.href = linkUrl;
      } else {
        await createPaymentLink();
      }
    } catch (err) {
      setError("Failed to process payment");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-8 text-black">
      <h2 className="text-3xl font-bold mb-6">Payment</h2>

      <div className="w-full bg-gray-100 p-6 rounded mb-6 text-black">
        <p>Booking ID: {bookingId}</p>
        <p>Amount: ₹{amount}</p>
      </div>

      <button
        onClick={handlePayNow}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-lg font-bold mt-4"
        disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {error && (
        <p className="mt-4 text-red-500">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}
    </div>
  );
};

export default Payments;
