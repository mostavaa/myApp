import { Product } from "../../models/Product";
import { Subject } from "rxjs";

export class ProductsService {
  endOfProducts: boolean;
  private productsRepository: Product[]
  private products: Product[]

  private page: number = 0;
  private take: number = 10;
  private size: number = 0;
  private pages: number = 0;
  private currentDepartmentGuid: string;

  productsSubject: Subject<Product[]> = new Subject<Product[]>();

  constructor() {
    this.currentDepartmentGuid = "all";
    this.productsRepository = [
      {
        name: "product1",
        departmentGuid: "1",
        description: "description of product 1",
        likes: 0,
        price: 10,
        guid: "1",
        picture: null
      },
      {
        name: "product2",
        departmentGuid: "11",
        description: "description of product 2",
        likes: 0,
        price: 10,
        guid: "2",
        picture: null
      },
      {
        name: "product3",
        departmentGuid: "11",
        description: "description of product 3",
        likes: 0,
        price: 10,
        guid: "3",
        picture: null
      },
      {
        name: "product4",
        departmentGuid: "1",
        description: "description of product 4",
        likes: 0,
        price: 10,
        guid: "4",
        picture: null
      },
      {
        name: "product5",
        departmentGuid: "1",
        description: "description of product 5",
        likes: 0,
        price: 10,
        guid: "5",
        picture: null
      },

      {
        name: "product6",
        departmentGuid: "1",
        description: "description of product 6",
        likes: 0,
        price: 10,
        guid: "6",
        picture: null

      },
      {
        name: "product7",
        departmentGuid: "1",
        description: "description of product 7",
        likes: 0,
        price: 10,
        guid: "7",
        picture: null

      },
      {
        name: "product8",
        departmentGuid: "1",
        description: "description of product 8",
        likes: 0,
        price: 10,
        guid: "8",
        picture: null

      },
      {
        name: "product9",
        departmentGuid: "1",
        description: "description of product 9",
        likes: 0,
        price: 10,
        guid: "9",
        picture: null

      },
      {
        name: "product10",
        departmentGuid: "1",
        description: "description of product 10",
        likes: 0,
        price: 10,
        guid: "10",
        picture: null

      },
      {
        name: "product11",
        departmentGuid: "1",
        description: "description of product 11",
        likes: 0,
        price: 10,
        guid: "11",
        picture: null

      },
      {
        name: "product12",
        departmentGuid: "1",
        description: "description of product 12",
        likes: 0,
        price: 10,
        guid: "12",
        picture: null

      },
      {
        name: "product13",
        departmentGuid: "1",
        description: "description of product 13",
        likes: 0,
        price: 10,
        guid: "13",
        picture: null

      },
      {
        name: "product14",
        departmentGuid: "1",
        description: "description of product 14",
        likes: 0,
        price: 10,
        guid: "14",
        picture: null

      },
      {
        name: "product15",
        departmentGuid: "1",
        description: "description of product 15",
        likes: 0,
        price: 10,
        guid: "15",
        picture: null

      },
      {
        name: "product16",
        departmentGuid: "1",
        description: "description of product 16",
        likes: 0,
        price: 10,
        guid: "16",
        picture: null

      },
      {
        name: "product17",
        departmentGuid: "1",
        description: "description of product 17",
        likes: 0,
        price: 10,
        guid: "17",
        picture: null

      },
      {
        name: "product18",
        departmentGuid: "1",
        description: "description of product 18",
        likes: 0,
        price: 10,
        guid: "18",
        picture: null

      },
      {
        name: "product20",
        departmentGuid: "1",
        description: "description of product 20",
        likes: 0,
        price: 10,
        guid: "20",
        picture: null

      },
      {
        name: "product21",
        departmentGuid: "1",
        description: "description of product 21",
        likes: 0,
        price: 10,
        guid: "21",
        picture: null

      },
      {
        name: "product22",
        departmentGuid: "1",
        description: "description of product 22",
        likes: 0,
        price: 10,
        guid: "22",
        picture: null

      },
      {
        name: "product23",
        departmentGuid: "1",
        description: "description of product 23",
        likes: 0,
        price: 10,
        guid: "23",
        picture: null

      },
      {
        name: "product24",
        departmentGuid: "1",
        description: "description of product 24",
        likes: 0,
        price: 10,
        guid: "24",
        picture: null

      },
      {
        name: "product25",
        departmentGuid: "1",
        description: "description of product 25",
        likes: 0,
        price: 10,
        guid: "25",
        picture: null

      },
      {
        name: "product26",
        departmentGuid: "1",
        description: "description of product 26",
        likes: 0,
        price: 10,
        guid: "26",
        picture: null

      },
      {
        name: "product27",
        departmentGuid: "1",
        description: "description of product 27",
        likes: 0,
        price: 10,
        guid: "27",
        picture: null

      },
      {
        name: "product28",
        departmentGuid: "1",
        description: "description of product 28",
        likes: 0,
        price: 10,
        guid: "28",
        picture: null

      },
      {
        name: "product29",
        departmentGuid: "1",
        description: "description of product 29",
        likes: 0,
        price: 10,
        guid: "29",
        picture: null

      },
      {
        name: "product30",
        departmentGuid: "1",
        description: "description of product 30",
        likes: 0,
        price: 10,
        guid: "30",
        picture: null


      },
      {
        name: "product31",
        departmentGuid: "1",
        description: "description of product 31",
        likes: 0,
        price: 10,
        guid: "31",
        picture: null

      }
    ];
    this.initProducts("all");
  }
  initProducts(currentDepartmentGuid:string) {
    this.currentDepartmentGuid = currentDepartmentGuid;
    this.products = [];
    this.page = 0;
    if (this.currentDepartmentGuid != "all") {
      this.size = this.productsRepository.filter(o => o.departmentGuid == this.currentDepartmentGuid).length
    } else {
      this.size = this.productsRepository.length;
    }
    this.pages = Math.floor(this.size / this.take);
    if (this.page >= 0 && this.page < this.pages)
      this.endOfProducts = false;
  }

  getProducts() {
    this.get();
    this.page++;
  }
  private get() {
    if (this.page >= 0 && this.page <= this.pages) {
      let products = [];
      if (this.currentDepartmentGuid != "all") {
        products = this.productsRepository.filter(o => o.departmentGuid == this.currentDepartmentGuid).slice(this.page * this.take, (this.page * this.take) + this.take);// get from server
      } else {
        products = this.productsRepository.slice(this.page * this.take, (this.page * this.take) + this.take);// get from server
      }

      this.products.push(...products);
      this.productsSubject.next(products);
    } else {
      this.endOfProducts = true;
    }
  }
  getByGuid(guid: string): Product {
    for (var i = 0; i < this.productsRepository.length; i++) {
      if (this.productsRepository[i].guid == guid) {
        return this.productsRepository[i];
      }
    }
    return null;
  }
}
