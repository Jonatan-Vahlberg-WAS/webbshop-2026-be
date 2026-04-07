import { Router } from "express";
import {
  getAllTrades,
  getTradeById,
  createTrade,
  deleteTrade,
  updateTrade,
} from "../db/trades.js";

const tradeRouter = Router();

// GET /trades
tradeRouter.get("/", async (req, res) => {
  // TODO Validation for Admin
  const trades = await getAllTrades();

  res.json(trades);
});

// GET /trades/:id
tradeRouter.get("/:id", async (req, res) => {
  // TODO Validation for Admin

  const id = req.params.id;
  const trade = await getTradeById(id);

  if (!trade) {
    return res.status(404).json({
      message: "Trade not found",
    });
  }

  res.json(trade);
});

// TODO GET /trades/mine
// TODO Validation for User and Admin

// POST /trades
tradeRouter.post("/", async (req, res) => {
  // TODO Validation for User (ownerId !== requesterId) and Admin
  const { plantId, requesterId } = req.body;

  if (!plantId || !requesterId) {
    return res.status(400).json({
      message: "plantId, requesterId are required",
    });
  }

  const trade = await createTrade({ plantId, requesterId });

  res.status(201).json(trade);
});

// TODO PATCH /trades/:id/status
tradeRouter.patch("/:id/status", async (req, res) => {
  // TODO Validation for User (owner) and Admin

  const id = req.params.id;
  const status = req.body.status;

  const updatedTrade = await updateTrade(id, {
    status,
  });

  if (!updatedTrade) {
    return res.status(404).json({
      message: "Trade does not exist",
    });
  }

  return res.status(200).json(updatedTrade);
});

// DELETE /trades/:id
tradeRouter.delete("/:id", async (req, res) => {
  // TODO Validation for User (requester) and Admin

  const id = req.params.id;

  const deleted = await deleteTrade(id);

  if (!deleted) {
    return res.status(404).json({
      message: "Trade does not exist",
    });
  }

  return res.status(204).json();
});

export default tradeRouter;
