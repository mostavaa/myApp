import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DepartmentService } from '../../services/dept.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.css']
})
export class NewDepartmentComponent implements OnInit {
  id: string = null;
  elId: string = null;
  departmentName = '';
  newDepartmentName: string = '';
  departmentForm: FormGroup;
  editedDepartmentName: string = '';
  editMode = false
  editedDepartment:Department
  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.elId = params['elId'];
        this.id = params['id'];
        if (this.elId) {
          this.editMode = true
          this.editedDepartment =  this.departmentService.getById(this.elId)
          if(this.editedDepartment){
            this.departmentForm.patchValue({"departmentName" :this.editedDepartment.deptName })
          }
        } 
      }
    )
    this.departmentForm = new FormGroup({
      'departmentName': new FormControl(
        null
        , [Validators.required, Validators.minLength(3)])
    })

    this.departmentService.departmentsObservable.subscribe((departments=>{
      if (this.elId) {
        this.editMode = true
        this.editedDepartment =  this.departmentService.getById(this.elId)
        if(this.editedDepartment){
          this.departmentForm.patchValue({"departmentName" :this.editedDepartment.deptName })
        }
      }
    }))
  }

  submitForm() {
    //console.log(this.departmentForm);
    if (!this.editMode) {
      this.departmentService.addNewDepartment(this.departmentForm.value['departmentName'], this.id ? this.id : '');
    } else {
      this.editDepartment();
    }
  }


  editDepartment() {
    this.departmentService.editDepartment(this.departmentForm.value['departmentName'], this.elId);
  }

}
