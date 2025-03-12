import express from "express";
import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import { connect } from "./db/db.js";
import captainModel from "./models/captain.model.js";
import captainRouter from "./routes/captain.routes.js";
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

app.use("/", captainRouter);
const server = http.createServer(app);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(
    `Captain service is running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
