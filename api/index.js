import { app } from "../src/app.js";
import { connectToDatabase } from "../src/config/database.js";

export default async function handler(req, res) {
  await connectToDatabase();
  return app(req, res);
}
