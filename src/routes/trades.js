import { Router } from "express";
import { getAllTrades, getTradeById } from "../db/trades.js";

const tradeRouter = Router();

tradeRouter.get("/", async (req, res) => {
  const trades = await getAllTrades();
  res.json(trades);
});

tradeRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const trade = await getTradeById(id);

  if (!trade) {
    return res.status(404).json({
      message: "Trade not found",
    });
  }

  res.json(trade);
});

export default tradeRouter;
