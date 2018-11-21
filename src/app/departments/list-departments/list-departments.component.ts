import { DepartmentService } from './../../services/departments/department.service';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { Department } from '../../services/models';
import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations'
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-list-departments',
  templateUrl: './list-departments.component.html',
  styleUrls: ['./list-departments.component.css'],
  animations: [
    trigger('slideInOut', [
      state('*',
        style({
          opacity: 1,
          transform: ' translateX(0px)',
        })
      ),
      transition(':enter', [
        style({
          opacity: 0,
          transform: ' translateX(400px)',
        }),
        animate('1s ease')
      ]),
      transition(':leave', [
        animate('1s ease', style({
          position:'absolute',
          opacity: 0,
          transform: ' translateX(-400px)',
        }))
      ])
    ])]
})
export class ListDepartmentsComponent implements OnInit {
  node: Department;
  departments: Department[]
  routeDepartmentGuid: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private authService: AuthService
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
          this.routeDepartmentGuid = val.state.root.firstChild.params["departmentGuid"];
        }
      }
    });
  }
  isLogged() {
    return this.authService.isLogged();
  }
  navigateToDepartment(guid) {
    this.router.navigate(['/products', guid]);
  }
  navigateToAdd(guid: string) {
    this.router.navigate(['createDepartment', guid, 'create']);
  }
  navigateToEdit(guid: string) {
    this.router.navigate(['createDepartment', guid, 'edit']);

  }
  getDepartmentByGuid(guid: string) {
    let department = this.departmentService.getDepartmentByGuid(guid);
    if (department) {
      this.departments = department.children;
      this.node = department;
    } else {
      this.departments = this.departmentService.getDepartments();
      this.node = {
        name: "",
        children: this.departments,
        guid: '',
        parentGuid: ''
      };
    }
  }
  navigateToChild(guid: string) {
    this.getDepartmentByGuid(guid);
  }
}
