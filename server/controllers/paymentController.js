import { ObjectId } from "mongodb";
import axios from "axios";

// Create payment link with Cashfree
export const createPaymentLinkController = async (
  req,
  res,
  paymentCollection
) => {
  try {
    const { totalAmount, email, username } = req.query;
    const body = req.body || {};

    if (!totalAmount || !email || !username) {
      return res.status(400).json({
        error: "totalAmount, email, and username are required",
      });
    }

    let requestBody = { ...body };
    if (body.travellers) {
      requestBody.travellers = body.travellers.toString();
    }

    // Create unique link ID
    const linkId = "link_" + Date.now();

    // Prepare Cashfree API request
    const cashfreeRequest = {
      customer_details: {
        customer_email: email,
        customer_name: username,
        customer_phone: "9999999999",
      },
      link_amount: totalAmount,
      link_currency: "INR",
      link_purpose: "Payment for Tickets",
      link_id: linkId,
      link_meta: {
        notify_url: `${process.env.BACKEND}/cashfree-webhook`,
        return_url: `${process.env.FRONTEND}/payment-status`,
        upi_intent: false,
      },
      payment_methods: ["upi"],
      link_expiry_time: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      link_notify: {
        send_email: false,
        send_sms: false,
      },
      link_partial_payments: false,
      link_auto_reminders: true,
      link_notes: requestBody,
    };

    // Call Cashfree API
    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/links",
      cashfreeRequest,
      {
        headers: {
          "x-api-version": "2025-01-01",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.link_url && response.data.link_id) {
      res.json({
        link_url: response.data.link_url,
        link_id: response.data.link_id,
      });
    } else {
      res.status(500).json({
        error: "Payment link creation failed: No link returned from Cashfree",
      });
    }
  } catch (error) {
    console.error(
      "Payment link creation error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: error.response?.data?.message || "Payment link creation failed",
    });
  }
};

// Save payment details to database
export const addPaymentDetailsController = async (
  req,
  res,
  paymentCollection
) => {
  try {
    const { bookingId, email, amount, linkId } = req.body;

    if (!bookingId || !email || !amount || !linkId) {
      return res.status(400).json({
        status: "error",
        error: "bookingId, email, amount, and linkId are required",
      });
    }

    await paymentCollection.insertOne({
      bookingId: new ObjectId(bookingId),
      email,
      amount: Number(amount),
      paymentStatus: null,
      method: "UPI",
      linkId,
      createdAt: new Date(),
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error adding payment details:", error);
    res
      .status(500)
      .json({ status: "error", error: "Failed to add payment details" });
  }
};

// Get payment details for a specific booking
export const getPaymentByBookingController = async (
  req,
  res,
  paymentCollection,
  ticketCollection
) => {
  try {
    const { bookingId } = req.params;

    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const payment = await paymentCollection.findOne({
      bookingId: new ObjectId(bookingId),
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    let bookingDetails = null;
    try {
      if (ticketCollection) {
        bookingDetails = await ticketCollection.findOne({
          _id: new ObjectId(bookingId),
        });
      }
    } catch (err) {
      console.error("Error fetching booking details:", err);
    }

    const paymentData = {
      ...payment,
      bookingDetails,
    };

    res.json(paymentData);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};

// Get all payments for a user
export const getUserPaymentsController = async (
  req,
  res,
  paymentCollection
) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const payments = await paymentCollection
      .find({
        email,
        paymentStatus: { $in: ["PAID", "FAILED"] },
      })
      .sort({ paymentDate: -1, createdAt: -1 })
      .toArray();

    res.json(payments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ error: "Failed to fetch user payments" });
  }
};

// Get all payments for admin
export const getAllPaymentsController = async (req, res, paymentCollection) => {
  try {
    const payments = await paymentCollection
      .find({
        paymentStatus: { $in: ["PAID", "FAILED"] },
      })
      .sort({ paymentDate: -1, createdAt: -1 })
      .toArray();

    res.json(payments);
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ error: "Failed to fetch all payments" });
  }
};

// Update payment status from Cashfree
export const updatePaymentStatusController = async (
  req,
  res,
  paymentCollection,
  ticketCollection
) => {
  try {
    const { bookingId } = req.params;

    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    // Get payment from database
    const payment = await paymentCollection.findOne({
      bookingId: new ObjectId(bookingId),
    });

    if (!payment || !payment.linkId) {
      return res.status(404).json({
        error: "Payment or linkId not found",
      });
    }

    // Check status with Cashfree API
    const statusResponse = await axios.get(
      `https://sandbox.cashfree.com/pg/links/${payment.linkId}`,
      {
        headers: {
          "x-api-version": "2025-01-01",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    // Convert Cashfree status to our status
    let newStatus = "PENDING";
    const cashfreeStatus = statusResponse.data.link_status;

    if (cashfreeStatus === "PAID") {
      newStatus = "PAID";
    } else if (cashfreeStatus === "ACTIVE" || cashfreeStatus === "EXPIRED") {
      newStatus = "FAILED";
    }

    console.log(`Payment status for ${payment.linkId}: ${newStatus}`);

    // Update payment record
    await paymentCollection.updateOne(
      { bookingId: new ObjectId(bookingId) },
      { $set: { paymentStatus: newStatus } }
    );

    // Update booking record
    await ticketCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { bookingStatus: newStatus } }
    );

    res.json({ status: newStatus });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      error: "Failed to update payment and booking status",
    });
  }
};
