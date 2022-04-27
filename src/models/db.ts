import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { DatabaseOptions } from "./types/db-option.type";

let mongod;

const db: DatabaseOptions = {
  HOST: process.env.DB_HOST ? process.env.DB_HOST : "localhost",
  DB: process.env.DB_NAME ? process.env.DB_NAME : "crud",
  USER: process.env.DB_USERNAME ? process.env.DB_USERNAME : "admin",
  PASS: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "root",
};

export const connectDb = async () => {
  // let dbUrl = `mongodb://localhost:27017/crud`;

  let dbUrl = `mongodb+srv://${db.USER}:${db.PASS}@${db.HOST}/${db.DB}?retryWrites=true&w=majority`;
  if (process.env.NODE_ENV === "test") {
    mongod = await MongoMemoryServer.create();
    dbUrl = mongod.getUri();
  }
  await mongoose
    .connect(dbUrl)
    // .connect()
    .then(() => {
      console.log("Successfully connect to MongoDB.");
    })
    .catch((err: unknown) => {
      console.error("Connection error", err);
      process.exit();
    });
};

export const disconnectDb = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
    console.log("Successfully disconnected from MongoDB.");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
