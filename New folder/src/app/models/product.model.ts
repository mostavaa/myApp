export class Product {
   
    constructor(
        public Name:string,
        public Description:string,
        public PicturePath:string,
        public Price:number,
        public Rate:number,
        public Likes:number,
        public DepartmentId:string,
        public guid:string
    ) {

    }
}