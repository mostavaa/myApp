import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/product.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  deptId = ''
  id = '';
  product: Product = new Product("6Product title", '6Product description... Lorem ipsum dolor sit amet, consectetuer adipiscing elit,sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.'
    , 'http://placehold.it/400x250/000/fff', +22, 5,
    5, '1', '66')
  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) { }
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.deptId = params["deptId"];
        this.id = params["id"];
        if(this.id){
          let product = this.productService.getById(this.id);
          if (product)
            this.product = product;
          else {
            this.productService.productSubject.subscribe((product) => {
              this.product = product;
            });
            this.productService.getByIdService(this.id);
          }
        }

      }
    )
  }

}
