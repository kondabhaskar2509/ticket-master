import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

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

function setupTicket(app, ticketCollection) {

  app.post("/bookings", verifyJWT, async (req, res) => {
    try {
      console.log("Received booking payload:", req.body);
      const {
        email,
        type,
        details,
        bookingStatus,
        price,
        date,
        link_id,
      } = req.body;


      const newBooking = {
        email,
        type,
        details,
        bookingStatus: null,
        price,
        date:new Date(),
        createdAt: new Date(),
        link_id: link_id,
      };
      const result = await ticketCollection.insertOne(newBooking);
      res.status(201).json({
        bookingStatus: newBooking.bookingStatus,
        bookingId: result.insertedId,
        booking: newBooking,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.get("/bookings/:id", verifyJWT, async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await ticketCollection.findOne({ _id: new ObjectId(id) });
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.get("/bookings/user/:email", verifyJWT, async (req, res) => {
    try {
      const { email } = req.params;
      const bookings = await ticketCollection
        .find({ email })
        .sort({ createdAt: -1 })
        .toArray();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user bookings" });
    }
  });

  app.get("/bookings/admin/all", verifyJWT, async (req, res) => {
    try {
      const bookings = await ticketCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all bookings" });
    }
  });

  app.put("/eventbooking/:id", verifyJWT, async (req, res) => {
    try {
      const { id } = req.params;
      const {newstatus } = req.body;

      await ticketCollection.findOne({ _id: new ObjectId(id) });

      await ticketCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: {bookingStatus:newstatus} }
      );
      res.json({ status: "success" });
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ error: "Failed to update booking" });
    }
  });
}

export default setupTicket;
