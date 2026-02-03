import React, { useEffect, useState } from "react";

const AllPayments = () => {
  const [allPayments, setAllPayments] = useState({});
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const fetchAllPayments = async () => {
    setLoadingPayments(true);
    try {
      const response = await fetch("http://localhost:5000/payments/admin/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      const paymentsByUser = {};
      if (Array.isArray(data)) {
        data.sort(
          (a, b) =>
            new Date(b.createdAt || b.paymentDate) -
            new Date(a.createdAt || a.paymentDate)
        );
        data.forEach((payment) => {
          const email = payment.email;
          if (!paymentsByUser[email]) {
            paymentsByUser[email] = [];
          }
          paymentsByUser[email].push(payment);
        });
      }
      setAllPayments(paymentsByUser);
    } catch (err) {
      setAllPayments({});
    } finally {
      setLoadingPayments(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        All User Transactions
      </h2>
      {loadingPayments ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading payment history...</p>
        </div>
      ) : Object.keys(allPayments).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No payment history found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(allPayments).map(([email, payments]) => (
            <div
              key={email}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
              <div className="bg-green-600 text-white px-6 py-4">
                <h3 className="text-xl font-bold">{email}</h3>
                <p className="text-sm opacity-80">
                  {payments.length} transactions
                </p>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden text-black">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 text-left">
                        <th className="py-3 px-4 font-semibold">Date</th>
                        <th className="py-3 px-4 font-semibold">
                          Transaction ID
                        </th>
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
                            {new Date(
                              payment.paymentDate || payment.createdAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs">
                            {payment.linkId}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs">
                            {payment.bookingId}
                          </td>
                          <td className="py-3 px-4">{payment.method}</td>
                          <td className="py-3 px-4 font-medium">
                            ₹{payment.amount}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.paymentStatus === "PAID"
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-200 text-red-800"
                              }`}>
                              {payment.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPayments;
