
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
export class Department {
  guid: string;
  name: string;
  nameAr?: string;
  parentGuid?: string;
  children: Department[];
  constructor() {
  }
}

export class Product {
  name: string;
  description: string;
  likes: number;
  price: number;
  departmentGuid: string;
  guid: string;
  picture: string;
  constructor() {

  }
}
