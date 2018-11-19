import { Department } from './../../models/Department';

export class DepartmentService {
  private departments: Department[]
  constructor() {

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
}
