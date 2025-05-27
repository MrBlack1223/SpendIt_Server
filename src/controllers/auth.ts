import { statusCode } from "../utils/statusMsg";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import  User  from "../models/user";
import jwt from "jsonwebtoken";
export class AuthController {
    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(statusCode.NO_CONTENT).json({ message: "All fields are required" });
            return;
        }
        try {
            const user = await User.findOne({ email });
            if (!user) {
                res.status(statusCode.NOT_FOUND).json({ message: "User not found" });
                return;
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(statusCode.UNAUTHORIZED).json({ message: "Invalid credentials" });
                return;
            }
            //generate JWT token
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "JWT secret not configured" });
                return;
            }
            const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

            res.status(statusCode.SUCCESS).cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 3600000,
                secure: process.env.NODE_ENV === 'production',
            }).json(
            { message: "Login successful", user: { _id: user._id, name: user.name, email: user.email }}
        )
            return;
            
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }
}