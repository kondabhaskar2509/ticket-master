import { Router } from "express";
import { verifyJWT } from "../middleware.js";
import * as ticketController from "../controllers/ticketController.js";

export const setupTicketRoutes = (router, ticketCollection) => {
  // Create booking (protected)
  router.post("/bookings", verifyJWT, (req, res) =>
    ticketController.createBookingController(req, res, ticketCollection)
  );

  // Get single booking (protected)
  router.get("/bookings/:id", verifyJWT, (req, res) =>
    ticketController.getBookingController(req, res, ticketCollection)
  );

  // Get user bookings (protected)
  router.get("/bookings/user/:email", verifyJWT, (req, res) =>
    ticketController.getUserBookingsController(req, res, ticketCollection)
  );

  // Get all bookings for admin (protected)
  router.get("/bookings/admin/all", verifyJWT, (req, res) =>
    ticketController.getAllBookingsController(req, res, ticketCollection)
  );

  // Update event booking status (protected)
  router.put("/eventbooking/:id", verifyJWT, (req, res) =>
    ticketController.updateEventBookingController(req, res, ticketCollection)
  );

  return router;
};
