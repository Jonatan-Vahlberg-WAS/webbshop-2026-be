import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
let connectionPromise = null;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(MONGODB_URI)
    .then((connection) => {
      console.log("Connected to MongoDB");
      return connection;
    })
    .catch((err) => {
      connectionPromise = null;
      console.error("MongoDB connection error:", err);
      throw err;
    });

  return connectionPromise;
}

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
