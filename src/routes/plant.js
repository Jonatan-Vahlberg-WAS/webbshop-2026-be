import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validatePlant, validatePlantResult } from "../middleware/plantValidation.js";
import Plant from "../models/plant.js";

const router = Router();

// GET all plants
router.get("/", async (req, res) => {
  const plants = await Plant.find();
  if (!plants || plants.length === 0) {
    return res.status(404).json({ message: "No plants found" });
  }
  res.json(plants);
});

// GET my plants  <-- måste ligga före /:id
router.get("/myplants", protect, async (req, res) => {
  const plants = await Plant.find({ ownerId: req.userId });
  res.json({ plants });
});

// GET plant by id
router.get("/:id", async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }
  res.json(plant);
});

// CREATE plant
router.post(
  "/",
  protect,
  validatePlant,
  validatePlantResult,
  async (req, res) => {
    const {
      plantName,
      description,
      light,
      water,
      imageUrl,
      coordinates,
      meetingTime,
      available,
    } = req.body;

    const newPlant = await Plant.create({
      plantName,
      description,
      light,
      water,
      imageUrl,
      coordinates,
      meetingTime,
      available: available ?? true,
      ownerId: req.userId,
    });

    res.status(201).json({ message: "Plant created", plant: newPlant });
  },
);

// UPDATE plant
router.put(
  "/:id",
  protect,
  validatePlant,
  validatePlantResult,
  async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    if (plant.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const {
      plantName,
      description,
      light,
      water,
      imageUrl,
      coordinates,
      meetingTime,
      available,
    } = req.body;

    plant.plantName = plantName ?? plant.plantName;
    plant.description = description ?? plant.description;
    plant.light = light ?? plant.light;
    plant.water = water ?? plant.water;
    plant.imageUrl = imageUrl ?? plant.imageUrl;
    plant.coordinates = coordinates ?? plant.coordinates;
    plant.meetingTime = meetingTime ?? plant.meetingTime;
    plant.available = available ?? plant.available;

    await plant.save();
    res.json({ message: "Plant updated", plant: plant });
  },
);

// Filter all plants
router.get("/", async (req, res) => {
  const { light, plantName } = req.query;

  const filter = {};

  if (light) filter.light = Number(light);
  if (plantName) filter.plantName = new RegExp(plantName, "i");

  const plants = await Plant.find(filter);
  res.json(plants);
});



// DELETE plant
router.delete("/:id", protect, async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }
  if (plant.ownerId.toString() !== req.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  await plant.deleteOne();
  res.json({ message: "Plant deleted" });
});



export default router;
