import mongoose, {  Schema } from 'mongoose';
import { IExpense} from '../types';

const expenseSchema: Schema = new Schema({
    description: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required:true }],
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    paidBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    splitType: { type: String, enum: ['equal', 'unequal'], default: 'equal' },
    splitAmounts: [{ type: Schema.Types.ObjectId, ref: 'SplitAmount', required: false }],
    notes: { type: String, required: false },
}, {
    timestamps: true,
});

const Expense = mongoose.model<IExpense>('Expenses', expenseSchema);

export default Expense;