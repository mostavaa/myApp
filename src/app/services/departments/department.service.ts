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

    this.departments = []


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
  getDepartmentByGuid(guid: string) {
    return this.httpService.invoke({
      method: 'GET',
      url: Constants.websiteEndPoint,
      path: 'Departments/get',
      query: { id: guid }
    }).pipe(
      map((res) => {
        if (res["status"] == true) {
          if (res["data"]) {
            return <Department>res.data;
          }
        }
        return <Department>{};
      }),
    )

  }
  add(name: string, nameAr: string, parent: string) {
    let node = {
      DeptName: name,
      DeptNameAr: nameAr
    }
    let query;
    if (parent != "0")
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
  delete(id: string) {
    let body = {
      id: id
    };
    return this.httpService.invoke({
      method: "POST",
      url: Constants.websiteEndPoint,
      path: 'Departments' + '/delete',
      query: body
    }).pipe(map(res => {
      if (res["status"] == true) {
        if (res["messages"]) {
          this.getDepartments().subscribe(depts => {
            this.departments = depts;
          });
          return { res: true, messages: <string[]>res.messages };
        }
      }
      if (res["messages"])
        return { res: false, messages: <string[]>res.messages };
      return { res: false, messages: <string[]>[] };
      }));
  }
  edit(name: string, nameAr: string, id: string) {
    let body = {
      DeptName: name,
      DeptNameAr: nameAr
    };
    debugger;
    return this.httpService.invoke({
      method: "POST",
      url: Constants.websiteEndPoint,
      path: 'Departments' + '/update',
      body: body,
      query: {
        id: id
      }
    }).pipe(
      map(res => {
        if (res["status"] == true) {
          if (res["messages"]) {
            this.getDepartments().subscribe(depts => {
              this.departments = depts;
            });
            return { res: true, messages: <string[]>res.messages };
          }
        }
        if (res["messages"])
          return { res: false, messages: <string[]>res.messages };
      return { res: false, messages: <string[]>[] };
      })
    )
  }
}
