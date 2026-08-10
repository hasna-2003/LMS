import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('Missing MongoDB connection string. Set MONGODB_URI in backend/.env.');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
}