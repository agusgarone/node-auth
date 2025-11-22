import dotenv from "dotenv";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    await client.connect();
    const database = client.db("database");
    return database.collection("refreshTokens");
  } catch (error) {
    console.error("Error connecting to MongoDB");
    console.error(error);
    await client.close();
    throw error;
  }
}

export class refreshTokensModel {
  static async getByToken(token) {
    const db = await connect();
    const refreshToken = await db.findOne({ token: token });
    return refreshToken;
  }

  static async getByUserId(userId) {
    const db = await connect();
    const refreshTokens = await db.find({ userId: userId }).toArray();
    return refreshTokens;
  }

  static async create({ input }) {
    const db = await connect();
    const newRefreshToken = await db.insertOne(input);
    return {
      id: newRefreshToken.insertedId,
      ...input,
    };
  }

  static async delete(token) {
    const db = await connect();
    const { deletedCount } = await db.deleteOne({ token: token });
    return deletedCount > 0;
  }

  static async deleteByUserId(userId) {
    const db = await connect();
    const { deletedCount } = await db.deleteMany({ userId: userId });
    return deletedCount;
  }

  static async deleteExpired() {
    const db = await connect();
    const now = new Date();
    const { deletedCount } = await db.deleteMany({ expiresAt: { $lt: now } });
    return deletedCount;
  }
}
