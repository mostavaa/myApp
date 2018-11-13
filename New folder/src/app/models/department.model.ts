export class Department {
  active: boolean;
   
    constructor(
        
        public deptName:string,
        public numberOfProducts:number,
        public guid:string,
        public children:Department[],
        public collapse:boolean,
    ) {

    }
}