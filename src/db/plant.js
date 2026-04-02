import Plant from "../models/Plant.js"
import { getFullTextSearch } from "../utils/fullTextSearch.js"

export async function getPlants(q) {
  let filter = {}
  if (q) {
    filter = {
      ...filter,
      ...getFullTextSearch(q, true, "name"),
    }
  }
  try {
    return await Plant.find(filter)
  } catch (err) {
    console.error("Unable to find based on query in 'Plants'", err)
    return []
  }
}

export async function getPlantById(id) {
  try {
    return await Plant.findById(id)
  } catch (err) {
    console.error("Unable to read from 'Plants'", err)
    return null
  }
}

export async function getPlantBySlug(slug) {
  //   console.log("Slug: ", slug)
  try {
    // console.log("Found plant by slug: ", Plant.findOne({ slug: slug }))
    return await Plant.findOne({ slug: slug })
  } catch (err) {
    console.error("Unable to read from 'Plants'", err)
    return null
  }
}

export async function createPlant(plantData) {
  try {
    const newPlant = new Plant(plantData)
    await newPlant.save()
    return newPlant
  } catch (error) {
    console.error("Error creating 'Plant':", error)
    throw error
  }
}

export async function updatePlantBySlug(slug, plantData) {
  try {
    return await Plant.findOneAndUpdate({ slug: slug }, plantData, {
      new: true,
    })
  } catch (error) {
    console.error("Error Updating 'Plant':", error)
    throw error
  }
}

export async function deletePlantBySlug(slug) {
  try {
    const plantToDelete = await Plant.findOne({ slug: slug })
    if (!plantToDelete) return null
    await Plant.deleteOne({ _id: plantToDelete._id })
    return true
  } catch (error) {
    console.error("Unable to delete 'Plant'", error)
    return false
  }
}

// export async function deletePlant(id) {
//   try {
//     const plantToDelete = await Plant.findById(id)
//     if (!plantToDelete) return null
//     await Plant.deleteOne({ _id: plantToDelete._id })
//     return true
//   } catch (error) {
//     console.error("Unable to delete 'Plant'", error)
//     return false
//   }
// }

//TODO: Add more functions as needed
