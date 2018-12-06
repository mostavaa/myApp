import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from '../../services/departments/department.service';
import { Department } from '../../services/models';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { DialogBodyComponent } from '../../shared/dialog-body/dialog-body.component';
import { Constants } from '../../services/constants';
import { AuthService } from '../../services/auth.service';


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
  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog, private route: ActivatedRoute, public departmentService: DepartmentService) { }

  ngOnInit() {
    
  
    this.route.params.subscribe((params) => {
      if (params["parentGuid"]) {
        this.parentDepartment = params["parentGuid"];
        this.editMode = false;
      } else if (params["departmentGuid"]) {
        this.editMode = true;
        this.departmentGuid = params["departmentGuid"];
        let department
   
          department = this.departmentService.getDepartmentByGuid(this.departmentGuid);
        if (department)
          department.subscribe(dept => {
            this.department = dept;
            this.initForm();
          });
      }
      this.initForm();

    })
  }
  translate(value: string) {
    let lang = this.authService.getLanguage();
    if (Constants.resources && Constants.resources[lang] && Constants.resources[lang][value])
      return Constants.resources[lang][value];
    else
      return value;
  }
  initForm() {
    let departmentNameControl = new FormControl(this.department ? this.department.name : null, [Validators.required, Validators.minLength(3)])
    let departmentNameArControl = new FormControl(this.department ? this.department.nameAr : null, [Validators.required, Validators.minLength(3)])
    this.departmentForm = new FormGroup({
      'departmentName': departmentNameControl,
      'departmentNameAr': departmentNameArControl
    });
  }
  successMessages: string[];
  errorMessages: string[];
  onSubmit() {

    if (this.departmentForm.valid) {
      if (!this.editMode) {
        this.departmentService.add(
          this.departmentForm.value['departmentName'],
          this.departmentForm.value['departmentNameAr'],
          this.parentDepartment).subscribe(res => {
            if (res["res"] == true) {
              this.successMessages = res["messages"];
              this.openDialog({ type: "success", data: this.successMessages }).afterClosed().subscribe(result => {
                location.reload();
              });
            }
          },
            error => {
              this.errorMessages = error["messages"];
              this.alertErrors();
            }
          );
      } else {
        this.departmentService.edit(
          this.departmentForm.value['departmentName'],
          this.departmentForm.value['departmentNameAr'],
          this.departmentGuid).subscribe(res => {
            if (res["res"] == true) {
              this.successMessages = res["messages"];
              this.openDialog({ type: "success", data: this.successMessages }).afterClosed().subscribe(result => {
                location.reload();
              });
            }
          },
            error => {
              this.errorMessages = error["messages"];
              this.alertErrors();
            }
          );
      }
    }
  }
  openDialog(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = data;
    let dialogRef = this.dialog.open(DialogBodyComponent, dialogConfig);
    return dialogRef;
  }

  alertErrors() {
    this.openDialog({ type: "error", data: this.errorMessages });
  }
  deleteDepartment() {
    this.openDialog({ isConfirm: true, type: "info", data: [this.translate('deleteConfirmation')] }).afterClosed().subscribe(result => {
      if (result && result == true) {
        this.departmentService.delete(this.departmentGuid).subscribe(
          res => {
            if (res["status"] == true) {
              this.successMessages = res["messages"];
              this.openDialog({ type: "success", data: this.successMessages }).afterClosed().subscribe(result => {
                this.router.navigate(["/"]);
              });
            }
          },
          error => {
            this.errorMessages = error["messages"];
            this.alertErrors();
          });
      } else {

      }
    });
  }

}
