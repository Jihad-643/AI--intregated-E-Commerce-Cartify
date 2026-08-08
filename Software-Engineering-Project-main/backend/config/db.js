import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI;

// Create a MongoClient with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database connection
let db;
let isConnected = false;
let connectionPromise = null;

export async function connectDB() {
  if (isConnected && db) {
    return db;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  // Start new connection
  connectionPromise = (async () => {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("✅ Successfully connected to MongoDB Atlas!");

      // Select your database
      db = client.db(process.env.DB_NAME || "ecommerce");
      isConnected = true;
      return db;
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
}

// Helper function to get database instance
export async function getDB() {
  if (!db) {
    await connectDB();
  }
  return db;
}

// Helper function to check connection status
export function isDBConnected() {
  return isConnected;
}
