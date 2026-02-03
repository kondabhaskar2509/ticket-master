import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, activeuser } = useContext(AuthContext);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");


  useEffect(() => {
    const bookingId = localStorage.getItem("payment_booking_id");
    if (bookingId) {
      fetch(`${process.env.BACKEND}/updatestatus/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          fetchPaymentDetails(bookingId);
        })
        .catch((err) => {
          setMessage("Error updating payment status. Please try again.");
          setMessageType("error");
          setShowMessage(true);
          setLoading(false);
        });
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchPaymentDetails = async (bookingId) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.BACKEND}/payments/booking/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment details");
      }

      const paymentData = await response.json();
      setPaymentDetails(paymentData);

      if (paymentData.paymentStatus === "PAID") {
        setMessageType("success");
        setShowMessage(true);

        await sendConfirmationEmail(paymentData);
        localStorage.removeItem("payment_booking_id");
        localStorage.removeItem(`payment_link_id_${bookingId}`);
        setTimeout(() => {
          navigate("/mybookings");
        }, 2000);
      } else if (paymentData.paymentStatus === "FAILED") {
        setMessage("Payment failed. Please try again.");
        setMessageType("error");
        setShowMessage(true);

        localStorage.removeItem("payment_booking_id");
        localStorage.removeItem(`payment_link_id_${bookingId}`);
        setTimeout(() => {
          navigate("/mybookings");
        }, 2000);
      } else {
        setMessage("Payment status is being verified. Please wait.");
        setMessageType("info");
        setShowMessage(true);
      }
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setMessageType("error");
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const sendConfirmationEmail = async (paymentData) => {
    try {
      await fetch(process.env.BACKEND + "/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: activeuser?.email || user?.email,
          type: "booking-confirmation",
          booking: paymentData.bookingDetails,
          payment: paymentData,
        }),
      });
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-2xl font-bold text-black mb-2">
              Checking payment status...
            </div>
            <p className="text-gray-600">
              Please wait while we verify your payment
            </p>
          </div>
        ) : showMessage ? (
          <div className="text-center">
            <div
              className={`text-2xl font-bold mb-4 ${messageType === "success"? "text-green-500": "text-red-500"}`}>
            </div>
            <div
              className={`text-2xl font-bold mb-4 ${messageType === "success"? "text-green-500": "text-red-500"}`}>
              {
                messageType === "success"? "Payment Successful!": "Payment Failed"
               }
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            {paymentDetails && (
              <div className="text-left bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Transaction ID:</strong> {paymentDetails.linkId}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Amount:</strong> ₹{paymentDetails.amount}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Payment Method:</strong> {paymentDetails.method}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4">
              Redirecting to your bookings...
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentStatus;
