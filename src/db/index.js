import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

console.log(process.env.DATABASE_URL)
const connectDB = async () => {
    try {
        // const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`)
        // console.log(`\n MongoDB connected! DB Host : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("Error : ", error)
        process.exit(1)
    }
}

export default connectDB;
