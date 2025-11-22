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
    return database.collection("users");
  } catch (error) {
    console.error("Error connecting to MongoDB");
    console.error(error);
    await client.close();
    throw error;
  }
}

export class usersModel {
  static async getAll() {
    const db = await connect();
    const users = await db.find().toArray();
    return users;
  }

  static async getById(id) {
    const db = await connect();
    const user = await db.findOne({ _id: id });
    return user;
  }

  static async getByEmail(email) {
    const db = await connect();
    const user = await db.findOne({ email: email });
    return user;
  }

  static async create({ input }) {
    const db = await connect();
    const newUser = await db.insertOne(input);
    return {
      id: newUser.insertedId,
      ...input,
    };
  }

  static async delete(id) {
    const db = await connect();
    const { deletedCount } = await db.deleteOne({ _id: id });
    return deletedCount > 0;
  }

  static async update({ id, input }) {
    const db = await connect();
    const { ok, value } = await db.findOneAndUpdate(
      { _id: id },
      { $set: input },
      { returnDocument: "after" }
    );
    return ok ? value : false;
  }
}
