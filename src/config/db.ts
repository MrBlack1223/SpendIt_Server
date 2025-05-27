import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_ACCESS || 'mongodb://localhost:27017/spendit', {});
        console.log('Connected to MongoDB');
    } catch (error) { 
        console.error('Error connecting to MongoDB:', error);
    }
}