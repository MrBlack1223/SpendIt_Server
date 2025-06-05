// group controller
import { Request, Response } from 'express';
import Group from '../models/group';
import { IGroup } from '../types';
import { RequestWithBody } from '../types';
import User from '../models/user';
import { IUser } from '../types';
import Expense from '../models/expense';

export class GroupController {
    async getGroups(req: Request, res: Response): Promise<Response> {
        try {
            const groups = await Group.find().populate('users', 'name email');
            return res.status(200).json(groups);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching groups', error });
        }
    }

    async createGroup(req: RequestWithBody<IGroup>, res: Response): Promise<Response> {
        try {
            const id = req.userId;
            const user = await User.findById(id);
            if(!user || !id){
                return  res.status(401).json({message: "Unauthorized"})
            }
            const { name, users } = req.body;
            users.push(user)
            const group = new Group({ name, users });
            await group.save();
            return res.status(201).json(group);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating group', error });
        }
    }

    async addUserToGroup(req: RequestWithBody<{ groupId: string; userId: string }>, res: Response): Promise<Response> {
        try {
            const { groupId, userId } = req.body;
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            group.users.push(user);
            await group.save();
            return res.status(200).json(group);
        } catch (error) {
            return res.status(500).json({ message: 'Error adding user to group', error });
        }
    }
    async addExpenseToGroup(req: RequestWithBody<{ groupId: string; expenseId: string }>, res: Response): Promise<Response> {
        try {
            const { groupId, expenseId } = req.body;
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
            const expense = await Expense.findById(expenseId);
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            group.expenses.push(expense);
            await group.save();
            return res.status(200).json(group);
        } catch (error) {
            return res.status(500).json({ message: 'Error adding expense to group', error });
        }
    }
    async getGroupExpenses(req: RequestWithBody<{ groupId: string }>, res: Response): Promise<Response> {
        try {
            const { groupId } = req.body;
            const group = await Group.findById(groupId).populate('expenses');
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
            return res.status(200).json(group.expenses);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching group expenses', error });
        }
    }
    async getGroupUsers(req: RequestWithBody<{ groupId: string }>, res: Response): Promise<Response> {
        try {
            const { groupId } = req.body;
            const group = await Group.findById(groupId).populate('users', 'name email');
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
            return res.status(200).json(group.users);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching group users', error });
        }
    }
}