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
