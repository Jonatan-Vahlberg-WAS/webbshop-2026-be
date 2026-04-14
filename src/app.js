// src/app.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./config/database.js";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import plantRouter from "./routes/plant.js";
import tradeRouter from "./routes/trade.js";

const app = express();



// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const endpoints = {
    general: [
      { method: "GET", path: "/" },
      { method: "GET", path: "/health" },
    ],
    auth: [
      { method: "POST", path: "/auth/register" },
      { method: "POST", path: "/auth/login" },
    ],
    user: [
      { method: "GET", path: "/user/me" },
      { method: "PUT", path: "/user/me" },
      { method: "DELETE", path: "/user/me" },
    ],
    admin: [
      { method: "GET", path: "/admin/users" },
      { method: "GET", path: "/admin/user/:id" },
      { method: "PUT", path: "/admin/user/:id" },
      { method: "DELETE", path: "/admin/user/:id" },
      { method: "GET", path: "/admin/plants" },
      { method: "DELETE", path: "/admin/plant/:id" },
      { method: "GET", path: "/admin/trades" },
    ],
    plants: [
      { method: "GET", path: "/plants" },
      { method: "GET", path: "/plants/myplants" },
      { method: "GET", path: "/plants/:id" },
      { method: "POST", path: "/plants" },
      { method: "PUT", path: "/plants/:id" },
      { method: "DELETE", path: "/plants/:id" },
    ],
    trades: [
      { method: "POST", path: "/trades" },
      { method: "GET", path: "/trades/me" },
      { method: "PATCH", path: "/trades/:id/approve" },
      { method: "PATCH", path: "/trades/:id/complete" },
    ],
  };

  const endpointsWithUrls = Object.fromEntries(
    Object.entries(endpoints).map(([group, list]) => [
      group,
      list.map((entry) => ({
        ...entry,
        url: `${baseUrl}${entry.path}`,
      })),
    ]),
  );

  res.json({
    message: "Webbshop API",
    stack: "MEN (MongoDB, Express, Node.js)",
    endpoints: endpointsWithUrls,
  });
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
