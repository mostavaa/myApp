import { Department } from './../../services/models';
import { HttpService } from '../http.service';
import { Constants } from '../constants';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
@Injectable()
export class DepartmentService {
  private departments: Department[]
  constructor(private httpService: HttpService) {

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
    return this.departments.slice();
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
        console.log("map");
        console.log(res);
      })).subscribe(success => {
        console.log("success");
        console.log(success);
      }, error => {
        console.log("error");
        console.log(error);
      })
  }
}
