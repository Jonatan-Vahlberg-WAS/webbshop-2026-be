import { Router } from "express";
import { getAllTrades, getTradeById, createTrade } from "../db/trades.js";

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

tradeRouter.post("/", async (req, res) => {
    const trade = await createTrade(req.body);
    res.status(201).json(trade);
})

export default tradeRouter;
