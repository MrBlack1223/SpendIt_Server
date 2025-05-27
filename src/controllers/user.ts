import { statusCode } from "../utils/statusMsg";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import  User  from "../models/user";
export class UserController {
    public async createUser (req: Request, res: Response): Promise<void> {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(statusCode.NO_CONTENT).json({ message: "All fields are required" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        try {
            await newUser.save();
        } catch (error) {
            console.error("Error saving user to database:", error);
            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
            return;
        }
        res.status(statusCode.SUCCESS).json({ message: "User created successfully", user: { newUser } });
    }
    public async getUser (req: Request, res: Response): Promise<void>{
        const userId = req.params.id;
        if (!userId) {
            res.status(statusCode.NO_CONTENT).json({ message: "User is not authenticated" });
            return;
        }
        try {
            const user = await User.findById(userId);
            if (!user) {
                res.status(statusCode.NOT_FOUND).json({ message: "User not found" });
                return;
            }
            const userWithNoPassword = {
                _id: user._id,
                name: user.name,
                email: user.email,
            }

            res.status(statusCode.SUCCESS).json({ userWithNoPassword });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }
}