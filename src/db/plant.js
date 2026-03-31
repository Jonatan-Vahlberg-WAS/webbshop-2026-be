import Plant from "../models/Plant.js";

export async function getPlants() {
  return await Plant.find();
}

export async function createPlant(plantData) {
    try {
        const plant = new Plant(plantData);
        await plant.save();
        return plant;
    } catch (error) {
        console.error("Error creating plant:", error);
        throw error;
    }
}

//TODO: Add more functions as needed