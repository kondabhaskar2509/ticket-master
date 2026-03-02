import express from "express";
import cors from "cors";
import mongodb from "mongodb";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import { setupAuthRoutes } from "./routes/authRoutes.js";
import { setupTicketRoutes } from "./routes/ticketRoutes.js";
import { setupPaymentRoutes } from "./routes/paymentRoutes.js";
import { setupDataRoutes } from "./routes/dataRoutes.js";
import { setupUploadRoutes } from "./routes/uploadRoutes.js";
import { setupEmailRoutes } from "./routes/emailRoutes.js";

dotenv.config();
const app = express();
const server = createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND,
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log(`connected user ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("recieve_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`disconnected user ${socket.id}`);
  });
});

const MongoClient = mongodb.MongoClient;
const url = process.env.MONGODB_URI;
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(url, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error("Database connection error:", err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    const authCollection = client.db("booking").collection("ticketmasterusers");
    const ticketCollection = client.db("booking").collection("ticket");
    const movieCollection = client.db("booking").collection("moviedata");
    const eventCollection = client.db("booking").collection("eventdata");
    const trainCollection = client.db("booking").collection("traindata");
    const paymentCollection = client.db("booking").collection("payment");
    const seatsCollection = client.db("booking").collection("seats");

    const router = express.Router();
    setupAuthRoutes(router, authCollection);
    setupTicketRoutes(router, ticketCollection);
    setupPaymentRoutes(router, paymentCollection, ticketCollection);
    setupDataRoutes(router, movieCollection, eventCollection, trainCollection);
    setupUploadRoutes(router);
    setupEmailRoutes(router);
    app.use("/", router);

    server.listen(port, () => {
      console.log(`✅ Server listening on port ${port}`);
    });
  });
