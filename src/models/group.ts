import mongoose, {  Schema } from 'mongoose';
import { IGroup} from '../types';

const groupSchema: Schema = new Schema({
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required:true}],
    expenses: [{type: Schema.Types.ObjectId, ref: 'Expense', required: false}],
}, {
    timestamps: true,
});

const Group = mongoose.model<IGroup>('Groups', groupSchema);

export default Group;