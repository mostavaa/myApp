import { DepartmentService } from './../../services/departments/department.service';
import { ActivatedRoute } from '@angular/router';
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
    private departmentService: DepartmentService
  ) { }

  ngOnInit() {
    this.departments = this.departmentService.getDepartments();
    this.route.params.subscribe((params) => {
      if (params["departmentGuid"])
        this.getDepartmentByGuid(params["departmentGuid"])
    })
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
