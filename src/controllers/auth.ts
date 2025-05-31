import { statusCode } from "../utils/statusMsg";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import  User  from "../models/user";
import jwt from "jsonwebtoken";
export class AuthController {
    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        console.log("Login request received:", { email, password });
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

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "JWT secret not configured" });
                return;
            }
            const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });
            res
            .status(statusCode.SUCCESS)
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 900000,
                secure: process.env.NODE_ENV === 'production',
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 86400000,
                secure: process.env.NODE_ENV === 'production'})
            .json(
            { message: "Login successful", user: { _id: user._id, name: user.name, email: user.email }}
        )
            return;
            
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }
    public async refreshToken(req: Request, res: Response): Promise<void> {
        const token = req.cookies.refreshToken;
        if (!token) {
            res.status(statusCode.UNAUTHORIZED).json({ message: "No refresh token provided" });
            return;
        }
        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "JWT secrett not configured" });
                return;
            }
            jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
                    if (err) {
                        return res.status(statusCode.FORBIDDEN).json({ message: 'Failed to authenticate token' });
                    }

                    const newToken = jwt.sign({ id: decoded.id }, jwtSecret, { expiresIn: '15m' });
                    const newRefreshToken = jwt.sign({ id: decoded.id }, jwtSecret, { expiresIn: '1d' });
                    
                    res
                    .status(statusCode.SUCCESS)
                    .cookie('token', newToken, {
                        httpOnly: true,
                        sameSite: 'lax',
                        maxAge: 900000,
                        secure: process.env.NODE_ENV === 'production',
                    })
                    .cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        sameSite: 'lax',
                        maxAge: 86400000,
                        secure: process.env.NODE_ENV === 'production',
                    })
                });
        } catch (error) {
            console.error("Error refreshing token:", error);
            res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }
}