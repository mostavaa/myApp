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
          position: 'absolute',
          opacity: 0,
          transform: ' translateX(-400px)',
        }))
      ])
    ])]
})
export class ListDepartmentsComponent implements OnInit {
  node: Department = {
    name: "",
    children: [],
    guid: '',
    parentGuid: ''
  };
  departments: Department[]
  routeDepartmentGuid: string;
  lang: string = "en";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.lang = this.authService.getLanguage();
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        if (val.state.root.firstChild.params["departmentGuid"]) {
          debugger;
          this.getDepartmentByGuid(val.state.root.firstChild.params["departmentGuid"])
          if (val.state.root.firstChild.params["departmentGuid"] == null) {
            this.getAllDepartments();
          }
        } else {
          this.getAllDepartments();
        }
      }
    });
  }
  getAllDepartments() {
    this.departmentService.getDepartments().subscribe((res: Department[]) => {
      this.departments = res;
      this.node = {
        name: "",
        children: [],
        guid: '',
        parentGuid: ''
      };
    })
  }
  isLogged() {
    return this.authService.isLogged();
  }
  navigateToDepartment(guid) {
    if (guid == null)
      this.router.navigate(['/products']);
    else
      this.router.navigate(['/products', guid]);
  }
  navigateToAdd(guid: string) {
    this.router.navigate(['createDepartment', guid, 'create']);
  }
  navigateToEdit(guid: string) {
    this.router.navigate(['createDepartment', guid, 'edit']);

  }
  getDepartmentByGuid(guid: string) {
    if (guid != null && guid != "") {
      let department = this.departmentService.getDepartmentByGuid(guid);

      if (department) {
        department.subscribe(dept => {
          this.departments = dept.children;
          this.node = dept;

        });
      }
    } else {
      this.navigateToDepartment(null);
    }
  }
  //navigateToChild(guid: string) {
  //  this.getDepartmentByGuid(guid);
  //}
}
