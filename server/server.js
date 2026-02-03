import express from "express";
import cors from "cors";
import mongodb from "mongodb";
import dotenv from "dotenv";

import setupAuth from "./database/auth.js";
import setupTicket from "./database/ticket.js";
import setupPayment from "./database/payment.js";
import setupData from "./database/data.js";

import setupCashfree from "./api/cashfree.js";
import setupMail from "./api/sendMail.js";
import setupCloudinary from "./api/cloudinary.js";


const app = express();
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGODB_URI;
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(url, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    const authcollection = client.db("booking").collection("auth");
    const ticketcollection = client.db("booking").collection("ticket");
    const moviecollection = client.db("booking").collection("moviedata");
    const eventcollection = client.db("booking").collection("eventdata");
    const traincollection = client.db("booking").collection("traindata");
    const paymentcollection = client.db("booking").collection("payment");

    setupAuth(app, authcollection);
    setupTicket(app, ticketcollection);
    setupPayment(app, paymentcollection, ticketcollection);
    setupData(app, moviecollection, eventcollection, traincollection);
    setupCashfree(app, paymentcollection);
    setupMail(app);
    setupCloudinary(app);

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  });
