import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products/product.service';
import { Product } from '../../models/Product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
  products: Product[] = [];
  departmentGuid: string;
  endOfProducts: boolean = false;
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.productsService.productsSubject.subscribe(products => {
      this.products.push(...products)
    })
    this.route.params.subscribe((params) => {
      this.endOfProducts = false;
      this.products = [];
      if (params["departmentGuid"]) {
        this.departmentGuid = params["departmentGuid"];
        this.productsService.getProducts(this.departmentGuid);
      } else {
        this.productsService.getProducts("all");
      }

    })
 
  }

  next() {
    this.productsService.getProducts(this.departmentGuid);
    this.endOfProducts = this.productsService.endOfProducts;
  }

}
