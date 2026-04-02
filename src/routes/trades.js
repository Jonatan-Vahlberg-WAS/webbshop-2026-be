import { Router } from "express";
import { getAllTrades, getTradeById, createTrade, deleteTrade } from "../db/trades.js";

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

tradeRouter.delete("/:id", async (req, res) => {
  const id = req.params.id
  const deleted = await deleteTrade(id)
  if (!deleted) {
    return res.status(404).json({
      message: "Trade does not exist"
    })
  }

  return res.status(204).json()
})

export default tradeRouter;
