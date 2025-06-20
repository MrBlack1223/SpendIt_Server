import express from 'express';
import { setAuthRoutes, setExpenseRoutes, setGroupRoutes, setUserRoutes } from './routes/index';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db';
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();

// Initialize routes
const userRoutes = setUserRoutes();
const authRoutes = setAuthRoutes();
const groupRoutes = setGroupRoutes();
const expenseRoutes = setExpenseRoutes();
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/group', groupRoutes);
app.use('/expense', expenseRoutes);

app.listen(PORT, () => {
    connectToDatabase()
    console.log(`Server is running on http://localhost:${PORT}`);
});