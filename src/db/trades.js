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

