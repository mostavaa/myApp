import { Subject } from "rxjs/Subject";
import { Product } from "../models/product.model";
import { Injectable } from "@angular/core";
import { Constants } from "./constants";
import { CRUDService } from "./CRUD.service";
@Injectable()
export class ProductsService {
    productsObservable;

    productSubject: Subject<Product>;

    private products: Product[];
    page: number = 0;
    count: number = 0;
    pageSize: number = Constants.pageSize
    constructor(
        private CRUDService: CRUDService
    ) {
        this.products = [];
        this.productsObservable = new Subject<Product[]>();
        this.productSubject = new Subject<Product>();
    }
    initProducts() {
        this.products = [];
    }
    getAll(deptId) {
        let query = {
            page: this.page,
            deptId: deptId ? deptId : null
        }
        this.CRUDService.controller = "products";
        this.CRUDService.getAll(query).subscribe(success => {
            if (success["result"])
                for (let index = 0; index < success.result.length; index++) {
                    const element = success.result[index];
                    this.products.push(new Product(
                        element.name,
                        element.description,
                        element.pictureContent,
                        +element.price,
                        +element.rate,
                        +element.likes,
                        element.deptGuid,
                        element.guid
                    ))
                }
            if (success["count"])
                this.count = success.count
            this.productsObservable.next(this.products);
        }, error => {

        })
    }
    getAllProductsByDepartmentId(DepartmentId: string) {
        this.getAll(DepartmentId);
    }

    addNew(product: Product): any {
        let body = {
            Name: product.Name,
            Description: product.Description,
            PictureContent: product.PicturePath,
            Price: product.Price,
            deptGuid: product.DepartmentId
        }
        this.CRUDService.controller = "products";
        this.CRUDService.add(body).subscribe(success => {
            if (success['id']) {
                this.products.push(product);
            }
        }, error => { })
    }

    edit(product: Product, guid) {
        let body= {
            Name: product.Name,
            Description: product.Description,
            PictureContent: product.PicturePath,
            Price: product.Price,
            deptGuid:guid
        }
        this.CRUDService.controller = "products";
        this.CRUDService.edit(body).subscribe(success => {
            for (let index = 0; index < this.products.length; index++) {
                if (this.products[index].guid == guid) {
                    this.products[index].Description = product.Description;
                    this.products[index].Likes = product.Likes;
                    this.products[index].Name = product.Name;
                    this.products[index].PicturePath = product.PicturePath;
                    this.products[index].Price = product.Price;
                    this.products[index].Rate = product.Rate;
                    return;
                }
            }
        }, error => {

        })

    }


    delete(guid) {
        this.CRUDService.controller = "products";
        this.CRUDService.delete(guid).subscribe(success => {
            if (success['status'] == '1')
                for (let index = 0; index < this.products.length; index++) {
                    if (this.products[index].guid == guid) {
                        this.products.splice(index, 1);
                        return;
                    }
                }
        }, error => { })

    }
    getById(id) {
        for (let index = 0; index < this.products.length; index++) {
            if (this.products[index].guid == id) {
                return this.products[index];
            }
        }
    }
    getByIdService(id) {
        let query = {
            id:id
        }
        this.CRUDService.controller = "products/get";
        this.CRUDService.getAll(query)
        .subscribe(success => {
            let product = new Product(success["name"], success["description"]
                , success["pictureContent"], +success["price"], +success["rate"],
                +success["likes"], success["deptGuid"], success["guid"]);
            this.productSubject.next(product);
        })
    }


}