import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from '../../services/departments/department.service';
import { Department } from '../../services/models';


@Component({
  selector: 'app-create-edit-department',
  templateUrl: './create-edit-department.component.html',
  styleUrls: ['./create-edit-department.component.css']
})
export class CreateEditDepartmentComponent implements OnInit {
  editMode: boolean = false;
  parentDepartment: string;
  departmentGuid: string;
  department: Department;

  departmentForm: FormGroup
  constructor(private route: ActivatedRoute, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["parentGuid"]) {
        this.parentDepartment = params["parentGuid"];
        this.editMode = false;
      } else if (params["departmentGuid"]) {
        this.editMode = true;
        this.departmentGuid = params["departmentGuid"];
        let department = this.departmentService.getDepartmentByGuid(this.departmentGuid);// it may not work and it needs a subscription
        if (department)
          this.department = department;
      }
      this.initForm();
    })
  }

  initForm() {
    let departmentNameControl = new FormControl(this.department ? this.department.name : null, [Validators.required, Validators.minLength(3)])
    let departmentNameArControl = new FormControl(this.department ? this.department.nameAr : null, [Validators.required, Validators.minLength(3)])
    this.departmentForm = new FormGroup({
      'departmentName': departmentNameControl,
      'departmentNameAr': departmentNameArControl
    });
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      if (!this.editMode) {
        this.departmentService.add(
          this.departmentForm.value['departmentName'],
          this.departmentForm.value['departmentNameAr'],
          this.parentDepartment);
      } else {
        //this.departmentService.edit(this.departmentForm.value['departmentName'], this.departmentGuid);
      }
    }
  }
  deleteDepartment() {
    let res = confirm("are you sure you want to delete this department !?");
    if (res) {
      //this.departmentService.delete(this.departmentGuid);
    }
  }

}
