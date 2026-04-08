// src/app.js
import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import plantRouter from "./routes/plant.js";
import tradeRouter from "./routes/trade.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Webbshop API", stack: "MEN (MongoDB, Express, Node.js)" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/plants", plantRouter);
app.use("/trades", tradeRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal server error" });
});

export default app;
