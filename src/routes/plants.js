import { Router } from "express";
import { validatePlant, validatePlantResult } from "../middleware/plantValidation.js";
import { createPlant, getPlants } from "../db/plant.js";
const plantRouter = Router();

plantRouter.get("/", async (req, res) => {
  const plants = await getPlants();
  res.json(plants);
});

//TODO: Add more routes as needed

//TODO GET /plants/:slug

plantRouter.post("/", validatePlant, validatePlantResult, async (req, res) => {
  const plant = await createPlant(req.body);
  res.status(201).json(plant);
});

//TODO PUT /plants/:slug

//TODO DELETE /plants/:slug
export default plantRouter;