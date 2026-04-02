import { Router } from "express";
import { getAllTrades } from "../db/trades.js";

const tradeRouter = Router();

tradeRouter.get("/", async (req, res) => {
  const trades = await getAllTrades();
  res.json(trades);
});

export default tradeRouter;
