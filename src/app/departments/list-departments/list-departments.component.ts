import { DepartmentService } from './../../services/departments/department.service';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { Department } from './../../models/Department';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-departments',
  templateUrl: './list-departments.component.html',
  styleUrls: ['./list-departments.component.css']
})
export class ListDepartmentsComponent implements OnInit {
  node: Department;
  departments: Department[]
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) { }

  ngOnInit() {
    this.departments = this.departmentService.getDepartments();
    this.node = {
      name: "",
      children: this.departments,
      guid: '',
      parentGuid: ''
    };
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        if (val.state.root.firstChild.params["departmentGuid"]) {
          this.getDepartmentByGuid(val.state.root.firstChild.params["departmentGuid"])
        }
      }
    });
  }
  navigateToDepartment(guid) {
    this.router.navigate(['/products', guid]);
  }
  navigateToAdd() {
    this.router.navigate(['']);
  }
  getDepartmentByGuid(guid: string) {
    let department = this.departmentService.getDepartmentByGuid(guid);
    if (department) {
      this.departments = department.children;
      this.node = department;
    }else{
      this.departments=this.departmentService.getDepartments();
      this.node={
        name:"",
        children:this.departments,
        guid:'',
        parentGuid:''
      };
    }
  }
  navigateToChild(guid: string) {
    this.getDepartmentByGuid(guid);
  }
}
