export class Department{
    guid:string;
    name:string;
    parentGuid?:string;
    children:Department[];
    constructor() {
    }
}