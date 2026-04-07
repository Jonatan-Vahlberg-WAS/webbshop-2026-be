import Trade from "../models/Trade.js"

export async function getAllTrades() {
  try {
    return await Trade.find()
      .populate(
        "plantId",
        "name image species meetingTime coordinates available",
      )
      .populate("requesterId", "name")
      .populate("ownerId", "name")
      .populate("status")
  } catch (error) {
    console.error("Unable to read from 'Trades'", error)
  }
}

export async function getTradeById(id) {
  try {
    return await Trade.findById(id)
      .populate(
        "plantId",
        "name image species meetingTime coordinates available",
      )
      .populate("requesterId", "name")
      .populate("ownerId", "name")
      .populate("status")
  } catch (error) {
    console.error("Unable to read from 'Trades'", error)
  }
}

export async function createTrade(tradeData) {
  try {
    const newTrade = new Trade(tradeData)
    await newTrade.save()
    return await Trade.populate(newTrade, "plantId requesterId ownerId")
  } catch (error) {
    console.error("Unable to create 'Trade'", error)
  }
}

export async function updateTrade(id, tradeData){
  try{
    const updatedTrade = await Trade.findById(id)
    updatedTrade.status = tradeData.status ?? updatedTrade.status
    await updatedTrade.save()
    console.log("Dunction: updateTrade:", updateTrade)
    return await Trade.populate(updatedTrade, "plantId requesterId ownerId")

  }catch(error){
    console.error("Unable to update 'Trade'", error)
  }
}

export async function deleteTrade(id){
  try{
    return !!(await Trade.findByIdAndDelete(id))
  }catch(error){
    console.error("Unable to delete 'Trade'", error)
  }
}
