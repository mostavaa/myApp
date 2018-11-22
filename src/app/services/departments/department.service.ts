import { Department } from './../../services/models';
import { HttpService } from '../http.service';
import { Constants } from '../constants';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
@Injectable()
export class DepartmentService {
  private departments: Department[]
  constructor(private httpService: HttpService, private authService: AuthService) {

    this.departments = [
      {
        name: "root1 department",
        guid: "1",
        parentGuid: '',
        children: [
          {
            name: "sub1 department of root1",
            guid: "11",
            parentGuid: "1",
            children: [{
              name: "sub11 department of sub1",
              guid: "111",
              parentGuid: "11",
              children: []
            }]
          },
          {
            name: "sub2 department of root1",
            guid: "12",
            parentGuid: "1",
            children: []
          },
        ]
      },
      {
        name: "root2 department",
        guid: "2",
        parentGuid: "",
        children: []
      }
    ];


  }
  getDepartments() {
    return this.httpService.invoke({
      method: 'GET',
      url: Constants.websiteEndPoint,
      path: 'Departments'
    }).pipe(
      map((res) => {
        if (res["status"] == true) {
          if (res["data"]) {
            let departments: Department[] = [];
            for (var i = 0; i < res.data.length; i++) {
              departments.push(<Department>res.data[i]);
            }
            return departments;
          }
        }
        return [];
      }),
      catchError((error) => {
        return [];
      })
    );
  }
  getDepartmentByGuid(guid: string): Department {
    return this.getDepartmentByGuidRecursive(this.departments, guid);
  }
  private getDepartmentByGuidRecursive(departments: Department[], guid: string): Department {
    for (let index = 0; index < departments.length; index++) {
      const element = departments[index];
      if (element.guid == guid)
        return element;
      return this.getDepartmentByGuidRecursive(element.children, guid);
    }
    return null;
  }
  departmentsSubject: Subject<Department[]> = new Subject<Department[]>();
  add(name: string, nameAr: string, parent: string) {
    let node = {
      DeptName: name,
      DeptNameAr: nameAr
    }
    let query;
    if (parent == "0")
      query = {
        parentDepartmentGuid: parent
      }
    return this.httpService.invoke({
      method: 'POST',
      url: Constants.websiteEndPoint,
      path: 'Departments' + '/add',
      body: node,
      query: parent != "0" ? query : null
    }).pipe(
      map((res) => {
        debugger;
        if (res["status"] == true) {
          if (res["data"]) {
            this.departments.push({
              name: name,
              nameAr: nameAr,
              children: [],
              guid: res.data.id,
            });
            this.getDepartments().subscribe(depts => {
              this.departments = depts;
              this.departmentsSubject.next(this.departments);
            });
          }
          if (res["messages"]) {
            return { res: true, messages: <string[]>res.messages };
          }
        }
        return <any>{ res: false, messages: <string[]>[] };
      })
      );
  }
}
