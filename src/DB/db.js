//connection
import { MongoClient } from "mongodb";
import {  DB_URI } from "../config.js";
import { mongoose } from 'mongoose';
import { UserModel } from "./model/user.model.js";
import { messageModel } from "./model/message.model.js";
const client = new MongoClient(DB_URI, { serverSelectionTimeoutMS: 30000 });
export const connectDB = async (app, port) => {

  try {
    await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 30000 })
    console.log("Database Connected"); 
    await connectRedis()
    await UserModel.syncIndexes()
    await messageModel.syncIndexes()
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Database Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};


export const db = client.db()