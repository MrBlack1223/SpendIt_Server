//expanse controller
import { Request, Response } from 'express';
import Expense from '../models/expense';
import { IExpense } from '../types';
import { RequestWithBody } from '../types';
import Group from '../models/group';
import User from '../models/user';
import { IUser } from '../types';

export class ExpenseController {
    async getExpenses(req: Request, res: Response): Promise<Response> {
        try {
            const expenses = await Expense.find().populate('users', 'name email').populate('group', 'name').populate('paidBy', 'name email');
            return res.status(200).json(expenses);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching expenses', error });
        }
    }

    async createExpense(req: RequestWithBody<IExpense>, res: Response): Promise<Response> {
        try {
            const { description, users, amount, date, group, paidBy, splitType, splitAmounts, notes } = req.body;
            const expense = new Expense({ description, users, amount, date, group, paidBy, splitType, splitAmounts, notes });
            await expense.save();
            return res.status(201).json(expense);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating expense', error });
        }
    }

    async addUserToExpense(req: RequestWithBody<{ expenseId: string; userId: string }>, res: Response): Promise<Response> {
        try {
            const { expenseId, userId } = req.body;
            const expense = await Expense.findById(expenseId);
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            expense.users.push(user);
            await expense.save();
            return res.status(200).json(expense);
        } catch (error) {
            return res.status(500).json({ message: 'Error adding user to expense', error });
        }
    }
}