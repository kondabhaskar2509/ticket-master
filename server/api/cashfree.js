import axios from "axios";
import { ObjectId } from "mongodb";

function setupCashfree(app, paymentCollection) {
  app.post("/create-payment-link", async (req, res) => {
    let { totalAmount, email, username } = req.query;
    let body = req.body;
    if (req.body.travellers) {
      body = { ...body, travellers: req.body.travellers.toString() };
    }

    try {
      const linkId = "link_" + Date.now();
      const requestBody = {
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
        link_notes: body,
      };

      const response = await axios.post(
        "https://sandbox.cashfree.com/pg/links",
        requestBody,
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
          error:
            "Payment link creation failed: No link_url or link_id returned",
          fullResponse: response.data,
        });
      }
    } catch (err) {
      console.error("Payment link error:", err.response?.data || err.message);
      res.status(500).json({
        error: err.response?.data || "Payment link creation failed",
        fullError: err.response
          ? {
              status: err.response.status,
              headers: err.response.headers,
              data: err.response.data,
            }
          : null,
      });
    }
  });

  app.post("/addpaymentdetails", async (req, res) => {
    try {
      const { bookingId, email, amount, linkId } = req.body;

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
    } catch (err) {
      console.error("Error in /addpaymentdetails:", err);
      res.status(500).json({ error: "Failed to add payment details" });
    }
  });
}

export default setupCashfree;
