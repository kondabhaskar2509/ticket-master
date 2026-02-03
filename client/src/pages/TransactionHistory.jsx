import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const TransactionHistory = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { activeuser } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        setIsLoading(true);
        // Use activeuser directly since it contains the email string
        const email = activeuser;
        
        console.log("Fetching payments for user:", email);
        
        if (!email) {
          console.log("No active user email found");
          setPayments([]);
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(
          `http://localhost:5000/payments/user/${email}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        
        if (!response.ok) {
          console.error("Error response from payments API:", response.status);
          setPayments([]);
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log("Payments data received:", data.length, "payments");
        
        // Show all payments with any paymentStatus (including null)
        setPayments(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPayments([]);
        setIsLoading(false);
      }
    };
    fetchRecentPayments();
  }, [activeuser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
          <h1 className="text-3xl text-[#36a3eb] font-bold text-center mb-8">
            Transaction History
          </h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-t-[#36a3eb] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading payment history...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 py-8 text-center">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#36a3eb] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                Retry
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No payment history found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-black">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 text-left">
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Transaction ID</th>
                    <th className="py-3 px-4 font-semibold">Booking ID</th>
                    <th className="py-3 px-4 font-semibold">Method</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50 text-black">
                      <td className="py-3 px-4">
                        {formatDate( payment.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {payment.linkId}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {payment.bookingId}
                      </td>
                      <td className="py-3 px-4">
                        {payment.method || "Unknown"}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ₹{payment.amount}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${payment.paymentStatus === "PAID" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
