import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../services/dept.service';
import { Department } from '../models/department.model';
import { Router, ActivatedRoute } from '@angular/router';
import {Subject} from 'rxjs/Subject';
import { HttpService } from '../services/http.service';
import { Constants } from '../services/constants';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private HttpService:HttpService
  ) { }

  ngOnInit() {
   
    this.departmentService.departmentsObservable.subscribe(
      (departments:Department[])=>{
        this.departments = departments;
      }
    );
    this.departmentService.getAllDepartments();

  }

  navigateNewDepartment() {
    this.router.navigate(['/departments','new'] )

  }
}
