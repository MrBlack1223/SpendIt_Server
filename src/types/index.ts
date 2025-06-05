export interface RequestWithBody<T> extends Express.Request {
    body: T;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

export interface SignupData {
    username: string;
    email: string;
    password: string;
}
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}
export interface IGroup extends Document {
    name: string;
    users: IUser[];
    expenses: IExpense[];
}
export interface ISplitAmount {
    user: IUser;
    amount: number;
}
export interface IExpense extends Document {
    description: string;
    users: IUser[];
    amount: number;
    date: Date;
    group: IGroup;
    paidBy: IUser;
    splitType: 'equal' | 'unequal';
    splitAmounts?: ISplitAmount[];
    notes?: string;
}
