import { Router } from "express"
import {
  validatePlant,
  validatePlantResult,
} from "../middleware/plantValidation.js"
import {
  createPlant,
  getPlants,
  // getPlantById,
  // deletePlant,
  getPlantBySlug,
  deletePlantBySlug,
  updatePlantBySlug,
} from "../db/plant.js"
const plantRouter = Router()

plantRouter.get("/", async (req, res) => {
  const { q } = req.query
  const plants = await getPlants(q)
  res.json(plants)
})

//TODO: Add more routes as needed

plantRouter.post("/", async (req, res) => {
  //kommer ha validering för user och admin
  //validatePlant, validatePlantResult,
  const plant = await createPlant(req.body)
  res.status(201).json(plant)
})

//TODO GET /plants/:slug
plantRouter.get("/:slug", async (req, res) => {
  const slug = req.params.slug
  const foundPlant = await getPlantBySlug(slug)
  if (!foundPlant) {
    return res.status(404).json({
      message: "Plant not found",
    })
  }
  res.json(foundPlant)
})
//TODO PUT /plants/:slug
plantRouter.put("/:slug", async (req, res) => {
  const slug = req.params.slug
  const { name, image, species, lightLevels, coordinates, meetingTime } =
    req.body

  if (
    !name ||
    !image ||
    !species ||
    !lightLevels ||
    !coordinates ||
    !meetingTime
  ) {
    return res.status(400).json({
      message:
        "All fields (name, image, species, lightLevels, and meetingTime) are required",
    })
  }
  const updatedPlant = await updatePlantBySlug(slug, {
    name,
    image,
    species,
    lightLevels,
    coordinates,
    meetingTime,
  })
  if (!updatedPlant) {
    return res.status(404).json({
      message: "Plant does not exist",
    })
  }
  return res.status(200).json(updatedPlant)
})

//TODO DELETE /plants/:slug
plantRouter.delete("/:slug", async (req, res) => {
  //kommer ha validering för user och admin
  const slug = req.params.slug
  const plant = await deletePlantBySlug(slug)
  if (!plant) {
    return res.status(400).json({
      message: "Plant does not exist",
    })
  }
  return res.status(204).json()
})

// plantRouter.get("/:id", async (req, res) => {
//   const id = req.params.id
//   const foundPlant = await getPlantById(id)
//   if (!foundPlant) {
//     return res.status(404).json({
//       message: "Plant not found",
//     })
//   }
//   res.json(foundPlant)
// })

// plantRouter.delete("/:id", async (req, res) => {
//   //kommer ha validering för user och admin
//   const id = req.params.id
//   const plant = await deletePlant(id)
//   if (!plant) {
//     return res.status(400).json({
//       message: "Plant does not exist",
//     })
//   }
//   return res.status(204).json()
// })

export default plantRouter
