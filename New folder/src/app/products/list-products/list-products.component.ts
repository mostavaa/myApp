import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/product.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Constants } from '../../services/constants';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
 
  editProduct(product: Product) {
    this.router.navigate([product.guid, 'edit'], { relativeTo: this.route })
  }
  removeProduct(guid: string) {
    this.productService.delete(guid);
  }

}
