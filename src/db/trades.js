import Trade from "../models/Trade.js"

export async function getAllTrades() {
  try{
    return await Trade.find()
    .populate("plantId", "name image species meetingTime coordinates available")
    .populate("requesterId", "name")
    .populate("ownerId", "name")
    .populate("status")
  } catch(error){
    console.error("Unable to read from 'Trades'", error)
  }
}

export async function getTradeById(id){
  try{
    return await Trade.findById(id)
    .populate("plantId", "name image species meetingTime coordinates available")
    .populate("requesterId", "name")
    .populate("ownerId", "name")
    .populate("status")
  }catch(error){
    console.error("Unable to read from 'Trades'", error)
  }
}

export async function createTrade(tradeData){
  try{
    const newTrade = new Trade(tradeData)
    await newTrade.save()
    return await Trade.populate(newTrade, "plantId requesterId ownerId")
  }catch(error){
    console.error("Unable to create 'Trade'", error)
  }
}