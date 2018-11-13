import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Department } from "../models/department.model";
import { CRUDService } from "./CRUD.service";
@Injectable()
export class DepartmentService {
    
    departmentsObservable;
    private departments: Department[];
    constructor(
        private CRUDService:CRUDService
    ) {
        this.departmentsObservable = new Subject<Department[]>();
        
    }
    deactivateItems(){
        this.deactivateDepartments(this.departments);
    }
    private deactivateDepartments(departments:Department[]){
        for (let index = 0; index < departments.length; index++) {
          const element = departments[index];
          element.active = false;
          this.deactivateDepartments(element.children);
        }
      }
    initDepartments(departmentsJson) {
        this.departments = [];
        for (let index = 0; index < departmentsJson.length; index++) {
            var element = departmentsJson[index];
            this.departments.push(new Department(element.deptName, element.numberOfProducts, element.guid, element.children, element.collapse))
        }
        this.departmentsObservable.next(this.departments);
    }


    getAllDepartments() {
        
        this.CRUDService.controller="departments";
        this.CRUDService.getAll().subscribe(
            success => {
                this.initDepartments(success);
            },
            error => {
                console.log(error)
            }
        );
        this.departmentsObservable.next(this.departments);
    }
    
    
    
    
    
    

    addNewDepartment(newDepartmentName: string, id: string): any {
        let node = {
            DeptName: newDepartmentName , 
            parentDepartmentGuid:id
        }
        this.CRUDService.controller="departments";
        this.CRUDService.add(node).subscribe(
            success => {
                if(success['id']){
                    this.successAddDepartment(newDepartmentName , success['id'] , id);
                }
            },
            error => {
                console.log(error)
            }
        )
    }
    private successAddDepartment(newDepartmentName , newId , id){
        if (id == null) {

            this.departments.push(new Department(
                newDepartmentName,
                0,
                newId,
                []
                , false));

        } else {
            var department = new Department(
                newDepartmentName,
                0,
                newId,
                []
                , false);
            let root = this.add(this.departments, department, id);
        }
        this.departmentsObservable.next(this.departments);
    }
    private add(departments: Department[], department: Department, guid: string) {

        for (let index = 0; index < departments.length; index++) {
            if (departments[index].guid == guid) {
                departments[index].children.push(department);
                return;
            }
            if (departments[index].children.length > 0)
                this.add(departments[index].children, department, guid);
        }
    }
    delete(guid) {
        this.CRUDService.controller="departments";
        this.CRUDService.delete(guid).subscribe(success=>{
            if(success['status'] == 1){
                this.remove(this.departments, guid);
            }
        }, error=>{})
    }
    private remove(departments, guid) {
        for (let index = 0; index < departments.length; index++) {
            if (departments[index].guid == guid) {
                departments.splice(index, 1);
                return;
            }
            if (departments[index].children.length > 0)
                this.remove(departments[index].children, guid);
        }
    }
    public editDepartment(editedDepartmentName, elId) {
        let node = {
            DepartmentName: editedDepartmentName ,
            id:elId
        } 
        this.CRUDService.controller="departments";
        this.CRUDService.edit(node).subscribe(
        (success)=>{
            if(success['status'] == 1){
                this.edit(this.departments, editedDepartmentName, elId);
            }
        },
        error=>{

        }
        )
    }
    private edit(departments: Department[], editedDepartmentName, elId) {
        for (let index = 0; index < departments.length; index++) {
            if (departments[index].guid == elId) {
                departments[index].deptName = editedDepartmentName;
                return;
            }
            if (departments[index].children.length > 0)
                this.edit(departments[index].children, editedDepartmentName, elId);
        }
    }

    getById(id){
        if(this.departments)
        return this.getByIdR(this.departments,id);
    }

    private getByIdR(departments,id){
        
        for (let index = 0; index < departments.length; index++) {
            if (departments[index].guid == id) {
                return departments[index];
            }
            if (departments[index].children.length > 0)
                this.getByIdR(departments[index].children, id);
        }
    }
    

}