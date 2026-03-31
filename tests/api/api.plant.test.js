import { describe, it, expect, afterAll, beforeEach } from "vitest";
import Plant from "../../src/models/Plant.js";
import request from "supertest";
import app from "../../src/app.js";
import { clearDatabase } from "../setup.js";

describe("API plants routes", () => {
  beforeEach(async () => {
    await clearDatabase();

    const plants = [
      new Plant({ name: "Plant 1", price: 100, stock: 10, image: "image.jpg", slug: "plant-1" }),
      new Plant({ name: "Plant 2", price: 200, stock: 20, image: "image.jpg", slug: "plant-2" }),
      new Plant({ name: "Plant 3", price: 300, stock: 30, image: "image.jpg", slug: "plant-3" })
    ];
    await Promise.all(plants.map(plant => plant.save()));
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe("GET /api/plants", () => {
    it("should return all plants", async () => {
      const response = await request(app)
        .get("/plants")
        .expect(200)
        .expect("Content-Type", /json/);
      const body = response.body;
      expect(body).toHaveLength(3);
    });
  });

  describe("POST /api/plants", () => {
    it("should create a new plant", async () => {
      const response = await request(app)
        .post("/plants")
        .send({ name: "Plant 4", price: 400, stock: 40, image: "image.jpg", slug: "plant-4" })
        .expect(201)
        .expect("Content-Type", /json/);
      const body = response.body;
      expect(body.name).toBe("Plant 4");
    });
  });

  describe("GET /api/plants/:slug", () => {
    it("should return a plant by slug", async () => {
      const response = await request(app)
        .get("/plants/plant-1")
        .expect(200)
        .expect("Content-Type", /json/);
      const body = response.body;
      expect(body.name).toBe("Plant 1");
    });
  });
});
