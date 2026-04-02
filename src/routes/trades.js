import { Router } from "express"
import {
  getAllTrades,
  getTradeById,
  createTrade,
  deleteTrade,
  updateTrade,
} from "../db/trades.js"

const tradeRouter = Router()

tradeRouter.get("/", async (req, res) => {
  const trades = await getAllTrades()
  res.json(trades)
})

tradeRouter.get("/:id", async (req, res) => {
  const id = req.params.id
  const trade = await getTradeById(id)

  if (!trade) {
    return res.status(404).json({
      message: "Trade not found",
    })
  }

  res.json(trade)
})

tradeRouter.post("/", async (req, res) => {
  const trade = await createTrade(req.body)
  res.status(201).json(trade)
})

tradeRouter.put("/:id", async (req, res) => {
  const id = req.params.id

  const { ownerId, requesterId, plantId, status } = req.body

  if (!ownerId || !requesterId || !plantId || !status) {
    return res.status(400).json({
      message: "OwnerId, requesterId, plantId and status is required",
    })
  }

  const updatedTrade = await updateTrade(id, {
    ownerId,
    requesterId,
    plantId,
    status,
  })
  if (!updatedTrade) {
    return res.status(404).json({
      message: "Trade does not exist",
    })
  }

  return res.status(200).json(updatedTrade)
})

tradeRouter.delete("/:id", async (req, res) => {
  const id = req.params.id
  const deleted = await deleteTrade(id)
  if (!deleted) {
    return res.status(404).json({
      message: "Trade does not exist",
    })
  }

  return res.status(204).json()
})

export default tradeRouter
