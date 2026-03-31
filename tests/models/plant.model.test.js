import { describe, it, expect, beforeEach } from "vitest";
import Plant from "../../src/models/Plant.js";
import { clearDatabase } from "../setup.js";

describe("Plant model", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("should create a new plant", async () => {
    const plant = new Plant({
      name: "Plant 1",
      price: 100,
      stock: 10,
      image: "image.jpg",
      slug: "plant-1",
    });
    await plant.save();
    expect(plant).toBeDefined();
  });

  it("should not create a plant with a negative price", async () => {
    const plant = new Plant({
      name: "Plant 1",
      price: -100,
      stock: 10,
      image: "image.jpg",
      slug: "plant-1",
    });
    await expect(plant.save()).rejects.toThrow();
  });

  it("should not create a plant with a negative stock", async () => {
    const plant = new Plant({
      name: "Plant 1",
      price: 100,
      stock: -10,
      image: "image.jpg",
      slug: "plant-1",
    });
    await expect(plant.save()).rejects.toThrow();
  });
});