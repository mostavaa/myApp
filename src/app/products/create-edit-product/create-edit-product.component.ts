import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Product } from '../../services/models';
import { ProductsService } from '../../services/products/product.service';
import {MatDialog,MatDialogConfig} from "@angular/material";
import { DialogBodyComponent } from '../../shared/dialog-body/dialog-body.component';
@Component({
  selector: 'app-create-edit-product',
  templateUrl: './create-edit-product.component.html',
  styleUrls: ['./create-edit-product.component.css']
})
export class CreateEditProductComponent implements OnInit {
  departmentGuid: string;
  guid: string;
  editMode: boolean = false;


  productForm: FormGroup;
  product: Product

  constructor(private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private productService: ProductsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["guid"]) {
        this.guid = params["guid"];
        this.editMode = true;
        let product = this.productService.getByGuid(this.guid).subscribe(res => {
          if (res && res["status"] && res.status == true) {
            if (res["data"]) {
              this.product = <Product>res.data;
              debugger;
              this.initForm();
            }
          }
        })
      } else {
        this.editMode = false;
      }
      this.initForm();
      if (params["departmentGuid"])
        this.departmentGuid = params["departmentGuid"];
    })
  }

  initForm() {
    let nameControl = new FormControl(this.product ? this.product.name : null, [Validators.required, Validators.minLength(3)]);
    let nameArControl = new FormControl(this.product ? this.product.nameAr : null, [Validators.required, Validators.minLength(3)]);
    let descriptionControl = new FormControl(this.product ? this.product.description : null, [Validators.required, Validators.minLength(3)]);
    let descriptionArControl = new FormControl(this.product ? this.product.descriptionAr : null, [Validators.required, Validators.minLength(3)]);
    let PictureControl = new FormControl(this.product ? this.product.picture : null, [Validators.required]);
    let PriceControl = new FormControl(this.product ? this.product.price : null, [Validators.required]);

    this.productForm = new FormGroup({
      Name: nameControl,
      NameAr: nameArControl,
      Description: descriptionControl,
      DescriptionAr: descriptionArControl,
      Picture: PictureControl,
      Price: PriceControl,

    })
  }
  delete() {
    this.openDialog({ isConfirm: true, type: "info", data: ["are you sure you want to delete this product !?"] }).afterClosed().subscribe(result => {
      if (result && result == true) {
        this.productService.delete(this.product.guid).subscribe(
          res => {
            if (res["status"] == true) {
              this.openDialog({ type: "success", data: res["messages"] }).afterClosed().subscribe(result => {
                this.router.navigate(["/products", this.product.departmentGuid]);
              });
            }
          },
          error => {
            this.openDialog({ type: "error", data: error["messages"] })
          });
      } else {

      }
    });
  }
  openDialog(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = data;
    let dialogRef = this.dialog.open(DialogBodyComponent, dialogConfig);
    return dialogRef;
  }
  onSubmit() {
    let product: Product = {
      departmentGuid: this.departmentGuid,
      description: this.productForm.get("Description").value,
      descriptionAr: this.productForm.get("DescriptionAr").value,
      name: this.productForm.get("Name").value,
      nameAr: this.productForm.get("NameAr").value,
      picture: this.productForm.get("Picture").value,
      price: this.productForm.get("Price").value,
      guid: this.guid,
      likes: 0
    }

    if (this.editMode) {
      this.productService.edit(product).subscribe(success => {
        if (success && success["status"] && success.status == true) {

          if (success["messages"]) {
            this.openDialog({ type: "success", data: success.messages }).afterClosed().subscribe(result => {
              location.reload();
            });
          }
        }
      },
        error => {
          if (error && error["messages"]) {
            if (error["messages"]) {
              this.openDialog({ type: "error", data: error.messages });
            }
          }
        });
    } else {
      this.productService.add(product).subscribe(success => {
        if (success && success["status"] && success.status == true) {

          if (success["messages"]) {
            this.openDialog({ type: "success", data: success.messages }).afterClosed().subscribe(result => {
              this.router.navigate(['/products', this.departmentGuid]);
            });
          }
        }
      },
        error => {
          if (error && error["messages"]) {
            if (error["messages"]) {
              this.openDialog({ type: "error", data: error.messages });
            }
          }
        });
    }
  }
  onFileChange(event) {

    this.productForm.patchValue({
      Picture: null
    });
    let reader = new FileReader();
    var fileTypes = ['jpg', 'jpeg', 'png'];
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      var extension = file.name.split('.').pop().toLowerCase(),
        isSuccess = fileTypes.indexOf(extension) > -1;
      if (isSuccess) {
        if (file.size > 10485760) //10 mb 
        {
          isSuccess = false;
        }
      }
      if (isSuccess) {
        reader.readAsDataURL(file);

        reader.onload = () => {

          this.productForm.patchValue({
            Picture: reader.result
          });
          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        };
      } else {

      }
    }
  }

}
