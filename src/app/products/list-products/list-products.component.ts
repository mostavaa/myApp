import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products/product.service';
import { Product } from '../../services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../services/constants';
@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
  products: Product[] = [];
  departmentGuid: string;
  lang: string = "en";
  uploadsFolder = Constants.uploadsFolder;
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService

  ) { }

  ngOnInit() {
    this.lang = this.authService.getLanguage();

    this.productsService.productsSubject.subscribe(products => {
      this.products.push(...products)
    })
    this.route.params.subscribe((params) => {
      this.products = [];
      if (params["departmentGuid"]) {
        this.departmentGuid = params["departmentGuid"];
        this.productsService.initProducts(this.departmentGuid);
        this.productsService.getProducts();
      } else {
        this.productsService.initProducts("all");
        this.productsService.getProducts();
      }
    })

  }
  isLogged() {
    return this.authService.isLogged();
  }
  next() {
    this.productsService.getProducts();
  }
  endOfProducts() {
    return this.productsService.page > this.productsService.pages
  }
  navigateToProduct(product: Product) {
    this.router.navigate(["/products", product.departmentGuid, product.guid]);
  }
  navigateToAdd() {
    if (this.departmentGuid) {
      this.router.navigate(["/createProduct", this.departmentGuid]);
    }
  }
}
