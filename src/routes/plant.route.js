import { Router } from "express";
import { protectReq } from "../middleware/authToken.js";
const router = Router();

import Plant from "../models/plant.js";

// get all plants
router.get("/", async (req, res) => {
  const plants = await Plant.find();
  if (!plants || plants.length === 0) {
    return res.status(404).json({ message: "No plants found" });
  }
  res.json(plants);
});

// get  plant by id
router.get("/:id", async (req, res) => {
  const plantId = req.params.id;
  const plant = await Plant.findById(plantId);
  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }
  res.json(plant);
});


// create a new plant
router.post("/", protectReq, async (req, res) => {
  const { plantName, light, water } = req.body;
  const ownerId = req.userId;
  const newPlant = new Plant({ plantName, light, water, ownerId });
  await newPlant.save();
  res.status(201).json(newPlant);
}
);

// update a plant
router.put("/:id", protectReq, async (req, res) => {
  const plantId = req.params.id;
  const { plantName, light, water } = req.body;
  const plant = await Plant.findById(plantId);  
  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }
  if (plant.ownerId.toString() !== req.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  plant.plantName = plantName || plant.plantName;
  plant.light = light || plant.light;
  plant.water = water || plant.water;
  await plant.save();
  res.json(plant);
});

// delete a plant
router.delete("/:id", protectReq, async (req, res) => {
  const plantId = req.params.id;
  const plant = await Plant.findById(plantId);
  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }
  if (plant.ownerId.toString() !== req.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  await plant.remove();
  res.json({ message: "Plant deleted" });
});

// get all plants for a user
router.get("/myplants", protectReq, async (req, res) => {
  const userId = req.userId;
  const plants = await Plant.find({
    ownerId: userId,
  });
  res.json(plants);
});

export default router;