import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products/product.service';
import { Product } from '../../models/Product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
  products: Product[] = [];
  departmentGuid: string;
  endOfProducts: boolean = true;
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {

    this.productsService.productsSubject.subscribe(products => {
      this.products.push(...products)
    })
    this.route.params.subscribe((params) => {
      this.products = [];
      if (params["departmentGuid"]) {
        this.departmentGuid = params["departmentGuid"];
        this.productsService.getProducts(this.departmentGuid);
      } else {
        this.productsService.getProducts("all");
      }
      this.endOfProducts = this.productsService.endOfProducts;
    })

  }

  next() {
    this.productsService.getProducts(this.departmentGuid);
    this.endOfProducts = this.productsService.endOfProducts;
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
