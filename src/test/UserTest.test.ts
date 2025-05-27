import { IndexController } from "../controllers/index";
import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { statusCode } from "../utils/statusMsg";
import { UserController } from "../controllers/user";

jest.mock("../models/user");

describe("IndexController - createUser", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let indexController: IndexController;
    let userController: UserController;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        indexController = new IndexController();
        userController = new UserController();
    });

    it("should return 204 if required fields are missing", async () => {
        req.body = { name: "", email: "", password: "" };

        await userController.createUser(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(statusCode.NO_CONTENT);
        expect(res.json).toHaveBeenCalledWith({ message: "All fields are required" });
    });

    it("should hash the password and save the user", async () => {
        req.body = { name: "John Doe", email: "john@example.com", password: "password123" };
        const hashedPassword = "hashedPassword123";
        (jest.spyOn(bcrypt, "hash") as jest.Mock).mockResolvedValueOnce(hashedPassword);
        (User.prototype.save as jest.Mock).mockResolvedValueOnce({});

        await userController.createUser(req as Request, res as Response);

        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
        expect(User.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(statusCode.SUCCESS);
        expect(res.json).toHaveBeenCalledWith({
            message: "User created successfully",
            user: { name: "John Doe", email: "john@example.com" },
        });
    });

    it("should return 500 if saving the user fails", async () => {
        req.body = { name: "John Doe", email: "john@example.com", password: "password123" };
        (jest.spyOn(bcrypt, "hash") as jest.MockedFunction<typeof bcrypt.hash>).mockResolvedValueOnce("hashedPassword123" as unknown as never);
        (User.prototype.save as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

        await userController.createUser(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(statusCode.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
});