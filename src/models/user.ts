import mongoose, {  Schema } from 'mongoose';
import { IUser } from '../types';

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
});

const User = mongoose.model<IUser>('UsersOfSpendIt', userSchema);

export default User;