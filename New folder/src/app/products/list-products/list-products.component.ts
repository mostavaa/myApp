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
  deptId: string;
  products: Product[] = [];
  canAdd = false;
  count = 0;
  page = 0;
  pagesCount = 0;
  loading = true;
  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.count = this.productService.count;
    this.productService.productsObservable.subscribe(
      (products: Product[]) => {
        this.products = products;
        this.count = this.productService.count;
         this.page=this.productService.page;
         this.pagesCount = this.count/Constants.pageSize;
         this.pagesCount = Math.floor(this.pagesCount);
         this.loading = false;
      }
    );
    this.route.params.subscribe(
      (params: Params) => {
        this.deptId = params["deptId"];
        this.initPage();
      }
    )
  }
  initPage() {
    if (this.deptId && this.deptId != 'all') {
      this.productService.getAllProductsByDepartmentId(this.deptId);
      this.canAdd = true;
    }
    else
      this.productService.getAll(null);
  }
  getMore() {
    this.loading = true;
    this.productService.page++;
    this.initPage();

  }
  navigateToProduct(guid: string) {
    this.router.navigate(['./', guid], { relativeTo: this.route })
  }
  addProduct() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }
  editProduct(product: Product) {
    this.router.navigate([product.guid, 'edit'], { relativeTo: this.route })
  }
  removeProduct(guid: string) {
    this.productService.delete(guid);
  }

}
