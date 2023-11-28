import mongoose from "mongoose";

export const connect = async() : Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected!");
    } catch (error) {
        console.log("Failed Database Connection!");
    }
}