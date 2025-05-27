import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { statusCode } from "../utils/statusMsg";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(statusCode.FORBIDDEN).json({ message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'JWT secret not configured' });
    }

    jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
        if (err) {
            return res.status(statusCode.FORBIDDEN).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        next();
    });
}

export default verifyToken;