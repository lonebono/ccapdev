//Import Relavent Modules
import mongoose from "mongoose";

//Connect to the database using the MONGODB_URI environment variable
export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("An error occurred whilst connecting to MongoDB: ", error);
    }
};