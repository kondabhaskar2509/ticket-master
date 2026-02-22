import express from "express";
import cors from "cors";
import mongodb from "mongodb";
import dotenv from "dotenv";

// Import all route setup functions
import { setupAuthRoutes } from "./routes/authRoutes.js";
import { setupTicketRoutes } from "./routes/ticketRoutes.js";
import { setupPaymentRoutes } from "./routes/paymentRoutes.js";
import { setupDataRoutes } from "./routes/dataRoutes.js";
import { setupUploadRoutes } from "./routes/uploadRoutes.js";
import { setupEmailRoutes } from "./routes/emailRoutes.js";

dotenv.config();

const app = express();
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection and route initialization
MongoClient.connect(url, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error("Database connection error:", err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    // Initialize database collections
    const authCollection = client.db("booking").collection("ticketmasterusers");
    const ticketCollection = client.db("booking").collection("ticket");
    const movieCollection = client.db("booking").collection("moviedata");
    const eventCollection = client.db("booking").collection("eventdata");
    const trainCollection = client.db("booking").collection("traindata");
    const paymentCollection = client.db("booking").collection("payment");

    // Create Express Router
    const router = express.Router();

    // Setup all routes
    setupAuthRoutes(router, authCollection);
    setupTicketRoutes(router, ticketCollection);
    setupPaymentRoutes(router, paymentCollection, ticketCollection);
    setupDataRoutes(router, movieCollection, eventCollection, trainCollection);
    setupUploadRoutes(router);
    setupEmailRoutes(router);

    // Apply router to app
    app.use("/", router);

    // Health check route
    app.get("/health", (req, res) => {
      res.json({ status: "OK", message: "Server is running" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Server error:", err);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        status: "error",
        message: "Route not found",
      });
    });

    // Start server
    app.listen(port, () => {
      console.log(`✅ Server listening on port ${port}`);
    });
  });
