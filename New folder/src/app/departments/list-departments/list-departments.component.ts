import { Component, OnInit, Input } from '@angular/core';
import { Department } from '../../models/department.model';
import { DepartmentService } from '../../services/dept.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/product.service';

@Component({
  selector: 'app-list-departments',
  templateUrl: './list-departments.component.html',
  styleUrls: ['./list-departments.component.css']
})
export class ListDepartmentsComponent implements OnInit {


  showSubMenu = false;
  @Input() treeData: Department[];
  id: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private productService:ProductsService
  ) { }

  ngOnInit() {
this.route.params.subscribe((params)=>{
  this.id = params["deptId"];
})
this.id = this.route.snapshot.params["deptId"];
  }
  activateThisItem(node:Department){
    this.departmentService.deactivateItems();
    node.active=true;
  }
 
  toggleSubMenu(node: Department, e: any) {
    this.showSubMenu = !this.showSubMenu;
    node.collapse = !node.collapse;
    e.preventDefault();
    e.stopPropagation();
  }
  navigateToNewDepartment(node : Department) {
    this.router.navigate(['/departments','new', node.guid] );
  }
  navigateToEditDepartment(node: Department) {
    this.router.navigate([ '/departments', 'edit', node.guid] );
  }
  navigateToDepartmentProducts(guid:string){
    this.productService.initProducts();
    this.router.navigate([ '/products', guid] );
  }
  removeDepartment(node: Department ){
    this.departmentService.delete(node.guid);
  }
}
