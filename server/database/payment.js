import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import axios from "axios";

const JWT_SECRET = "your-secret-key";

function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

function setupPayment(app, paymentCollection, ticketCollection) {
  app.get("/payments/booking/:bookingId", verifyJWT, async (req, res) => {
    try {
      const { bookingId } = req.params;
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
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });

  app.get("/payments/user/:email", verifyJWT, async (req, res) => {
    try {
      const { email } = req.params;
      const payments = await paymentCollection
        .find({
          email,
          paymentStatus: { $in: ["PAID", "FAILED"] },
        })
        .sort({ paymentDate: -1, createdAt: -1 })
        .toArray();

      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user payments" });
    }
  });

  app.get("/payments/admin/all", verifyJWT, async (req, res) => {
    try {
      const payments = await paymentCollection
        .find({
          paymentStatus: { $in: ["PAID", "FAILED"] },
        })
        .sort({ paymentDate: -1, createdAt: -1 })
        .toArray();

      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all payments" });
    }
  });

  app.put("/updatestatus/:bookingId", verifyJWT, async (req, res) => {
    try {
      const { bookingId } = req.params;
      const payment = await paymentCollection.findOne({
        bookingId: new ObjectId(bookingId),
      });
      if (!payment || !payment.linkId) {
        return res.status(404).json({ error: "Payment or linkId not found" });
      }

      const linkId = payment.linkId;
      const response = await axios.get(
        `https://sandbox.cashfree.com/pg/links/${linkId}`,
        {
          headers: {
            "x-api-version": "2025-01-01",
            "x-client-id": process.env.CASHFREE_CLIENT_ID,
            "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Cashfree API response:", response.data);
      let status = response.data.link_status;
      console.log("Cashfree link_status:", status);
      let newstatus = null;
      if (status === "PAID") {
        newstatus = "PAID";
      } else if (status === "ACTIVE" || status === "EXPIRED") {
        newstatus = "FAILED";
      } else {
        newstatus = status;
      }
      console.log("Computed newstatus:", newstatus);

      await paymentCollection.updateOne(
        { bookingId: new ObjectId(bookingId) },
        { $set: { paymentStatus: newstatus } }
      );
      await ticketCollection.updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { bookingStatus: newstatus } }
      );
      res.json({ status: newstatus });
    } catch (error) {
      console.error("Error updating payment and booking status:", error);
      res
        .status(500)
        .json({ error: "Failed to update payment and booking status" });
    }
  });
}
export default setupPayment;
