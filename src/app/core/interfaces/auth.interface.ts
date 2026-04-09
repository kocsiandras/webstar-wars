import { IUser } from "./user.interface";

export interface ILoginForm {
    username: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    refreshToken: string;
    user: IUser;
}