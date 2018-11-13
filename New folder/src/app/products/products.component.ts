import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  deptId = ''
  constructor(
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
 
  }

}
