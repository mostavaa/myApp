import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/Product';
import { ProductsService } from '../../services/products/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.css']
})
export class DetailsProductComponent implements OnInit {
  guid: string;
  product: Product
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    private authService: AuthService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["guid"]) {
        this.guid = params["guid"];
        this.initProduct();
      }
    })
  }
  isLogged() {
    return this.authService.isLogged();
  }
  initProduct() {
    let product = this.productService.getByGuid(this.guid);
    if (product) {
      this.product = product;
    }
  }

  navigateToEdit() {
    debugger;
    if (this.product && this.product.departmentGuid)
      this.router.navigate(["/editProduct", this.product.departmentGuid, this.guid]);
  }


}
