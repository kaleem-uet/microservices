import express from "express";
import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import { connect } from "./db/db.js";
import mongoose from "mongoose";
import Ride from "./models/ride.model.js"; // Assuming the ride model is in models folder
// Load environment variables based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
dotenv.config();
const app = express();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);
app.get("/", async (req, res) => {
  // insert a dummy ride
  try {
    const dummyRide = new Ride({
      user: new mongoose.Types.ObjectId(),
      pickup: "123 Main St",
      destination: "456 Elm St",
    });
    await dummyRide.save();
    res.status(201).send(dummyRide);
  } catch (error) {
    res.status(500).send({ error: "Failed to create ride" });
  }
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(
    `Ride service is running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
