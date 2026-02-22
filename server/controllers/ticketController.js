import { ObjectId } from "mongodb";

export const createBookingController = async (req, res, ticketCollection) => {
  try {
    console.log("Received booking payload:", req.body);
    const { email, type, details, bookingStatus, price, date, link_id } =
      req.body;

    if (!email || !type) {
      return res.status(400).json({
        error: "Email and type are required",
      });
    }

    const newBooking = {
      email,
      type,
      details: details || {},
      bookingStatus: bookingStatus || null,
      price: Number(price) || 0,
      date: date || new Date(),
      createdAt: new Date(),
      link_id: link_id || null,
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
};

export const getBookingController = async (req, res, ticketCollection) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await ticketCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

export const getUserBookingsController = async (req, res, ticketCollection) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const bookings = await ticketCollection
      .find({ email })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
};

export const getAllBookingsController = async (req, res, ticketCollection) => {
  try {
    const bookings = await ticketCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ error: "Failed to fetch all bookings" });
  }
};

export const updateEventBookingController = async (
  req,
  res,
  ticketCollection
) => {
  try {
    const { id } = req.params;
    const { newstatus } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    if (!newstatus) {
      return res.status(400).json({ error: "Status is required" });
    }

    const booking = await ticketCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await ticketCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { bookingStatus: newstatus } }
    );

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
};
