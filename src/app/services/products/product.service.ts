import { Product } from "../../services/models";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";
import { Constants } from "../constants";
@Injectable()
export class ProductsService {
  private products: Product[]

   page: number = 0;
  private take: number = 10;
  private size: number = 0;
   pages: number = 0;
  private currentDepartmentGuid: string;

  productsSubject: Subject<Product[]> = new Subject<Product[]>();

  constructor(private httpService: HttpService) {
    this.currentDepartmentGuid = "all";
    this.initProducts("all");
  }
  initProducts(currentDepartmentGuid: string) {
    this.currentDepartmentGuid = currentDepartmentGuid;
    this.products = [];
    this.page = 0;
    this.size = 1;
    this.pages = Math.floor(this.size / this.take);
    if ((this.size % this.take) == 0)
      this.pages--;
    //if (this.page >= 0 && this.page < this.pages)
    //  this.endOfProducts = false;
  }

  getProducts() {
    this.get();
    this.page++;
  }
  private get() {
    if (this.page >= 0 && this.page <= this.pages) {
      let query = {
        page: this.page
      };
      if (this.currentDepartmentGuid != "all")
        query["deptId"] = this.currentDepartmentGuid;
      this.httpService.invoke({
        method: 'GET',
        url: Constants.websiteEndPoint,
        path: 'Products/all',
        query: query
      }).subscribe(success => {
        if (success && success["status"] && success["status"] == true) {
          if (success["data"]) {
            if (success.data["result"]) {
              let products: Product[] = [];
              products = <Product[]>success.data.result;
              this.products.push(...products);
              this.productsSubject.next(products);
              this.size = success.data.count;
              this.pages = Math.floor(this.size / this.take);
              if ((this.size % this.take) == 0)
                this.pages--;
            }
          }
        }
      }, error => { });

    }
  }


  getByGuid(guid: string) {
    let query = {
      id: guid
    }
    return this.httpService.invoke({
      method: "GET",
      url: Constants.websiteEndPoint,
      path: 'Products/get',
      query: query,
    })
  }
  delete(id: string) {
    let body = {
      id: id
    };
    return this.httpService.invoke({
      method: "POST",
      url: Constants.websiteEndPoint,
      path: 'Products' + '/delete',
      query: body
    });
  }
  edit(product: Product) {
    let query = {
      id: product.guid
    }
    let body = {
      Name: product.name,
      NameAr: product.nameAr,
      Description: product.description,
      DescriptionAr: product.descriptionAr,
      Price: product.price,
      Pictures: product.pictures
    }
    return this.httpService.invoke({
      method: "POST",
      url: Constants.websiteEndPoint,
      path: 'Products/update',
      body: body,
      query: query
    });
  }
  add(product: Product) {
    let query = {
      deptGuid: product.departmentGuid
    };
    let body = {
      Name: product.name,
      NameAr: product.nameAr,
      Description: product.description,
      DescriptionAr: product.descriptionAr,
      Price: product.price,
      Pictures: product.pictures
    }
    return this.httpService.invoke({
      method: "POST",
      url: Constants.websiteEndPoint,
      path: 'Products/add',
      query: query,
      body: body
    });
  }
}
