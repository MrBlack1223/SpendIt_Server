import express from 'express';
import { setUserRoutes } from './routes/index';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db';
import cookieParser from "cookie-parser";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();

// Initialize routes
const userRoutes = setUserRoutes();
 app.use('/user', userRoutes);

app.listen(PORT, () => {
    connectToDatabase()
    console.log(`Server is running on http://localhost:${PORT}`);
});