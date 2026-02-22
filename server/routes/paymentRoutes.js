import { Router } from "express";
import { verifyJWT } from "../middleware.js";
import * as paymentController from "../controllers/paymentController.js";

export const setupPaymentRoutes = (
  router,
  paymentCollection,
  ticketCollection
) => {
  // Create payment link (public)
  router.post("/create-payment-link", (req, res) =>
    paymentController.createPaymentLinkController(req, res, paymentCollection)
  );

  // Add payment details (public)
  router.post("/addpaymentdetails", (req, res) =>
    paymentController.addPaymentDetailsController(req, res, paymentCollection)
  );

  // Get payment by booking ID (protected)
  router.get("/payments/booking/:bookingId", verifyJWT, (req, res) =>
    paymentController.getPaymentByBookingController(
      req,
      res,
      paymentCollection,
      ticketCollection
    )
  );

  // Get user payments (protected)
  router.get("/payments/user/:email", verifyJWT, (req, res) =>
    paymentController.getUserPaymentsController(req, res, paymentCollection)
  );

  // Get all payments for admin (protected)
  router.get("/payments/admin/all", verifyJWT, (req, res) =>
    paymentController.getAllPaymentsController(req, res, paymentCollection)
  );

  // Update payment status (protected)
  router.put("/updatestatus/:bookingId", verifyJWT, (req, res) =>
    paymentController.updatePaymentStatusController(
      req,
      res,
      paymentCollection,
      ticketCollection
    )
  );

  return router;
};
