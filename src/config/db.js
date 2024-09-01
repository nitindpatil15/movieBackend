import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../constant.js";

export const connectDB=async()=>{
    try {
        const database = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected Successfully ${database.connection.host}`)
    } catch (error) {
        console.log("MongoDB Failed to Connect!!!",error)
    }
}