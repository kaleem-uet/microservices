import express from "express";
import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import { connect } from "./db/db.js";
import userSchema from "./models/user.model.js";

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
  try {
    const user = new userSchema({
      name: "user",
      email: "user1@example.com",
      password: "password",
    });
    await user.save();
    res.status(201).send({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(
    `User service is running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
