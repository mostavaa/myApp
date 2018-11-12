
export interface ICurrentUser {
    accessToken?: string;
    refreshToken?: string;
    username?: string;//unique
    password?: string;
    mail?: string;
    id?: string;
}
export interface IErrorMessage{
    code?:number;
    message?:string;
    serverMessage?:string;
}
