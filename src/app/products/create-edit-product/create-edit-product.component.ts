import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Product } from '../../services/models';
import { ProductsService } from '../../services/products/product.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogBodyComponent } from '../../shared/dialog-body/dialog-body.component';
import { Constants } from '../../services/constants';
import { AuthService } from '../../services/auth.service';
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
    private router: Router,
    private authService: AuthService
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
  translate(value: string) {
    let lang = this.authService.getLanguage();
    if (Constants.resources && Constants.resources[lang] && Constants.resources[lang][value])
      return Constants.resources[lang][value];
    else
      return value;
  }
  initForm() {
    let nameControl = new FormControl(this.product ? this.product.name : null, [Validators.required, Validators.minLength(3)]);
    let nameArControl = new FormControl(this.product ? this.product.nameAr : null, [Validators.required, Validators.minLength(3)]);
    let descriptionControl = new FormControl(this.product ? this.product.description : null, [Validators.required, Validators.minLength(3)]);
    let descriptionArControl = new FormControl(this.product ? this.product.descriptionAr : null, [Validators.required, Validators.minLength(3)]);

    let PicturesArray = new FormArray([]);
    debugger;
    if (this.product) {
      for (var i = 0; i < this.product.pictures.length; i++) {
        let picCtrl = new FormControl(this.product.pictures[i]);
        PicturesArray.push(picCtrl);
      }
    }
    let PriceControl = new FormControl(this.product ? this.product.price : null, [Validators.required]);

    this.productForm = new FormGroup({
      Name: nameControl,
      NameAr: nameArControl,
      Description: descriptionControl,
      DescriptionAr: descriptionArControl,
      PicturesArray: PicturesArray,
      Price: PriceControl,

    })
  }
  delete() {
    this.openDialog({ isConfirm: true, type: "info", data: [this.translate('deleteConfirmation')] }).afterClosed().subscribe(result => {
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
    if (this.validImages()) {

      let product: Product = {
        departmentGuid: this.departmentGuid,
        description: this.productForm.get("Description").value,
        descriptionAr: this.productForm.get("DescriptionAr").value,
        name: this.productForm.get("Name").value,
        nameAr: this.productForm.get("NameAr").value,
        price: this.productForm.get("Price").value,
        guid: this.guid,
        likes: 0,
        pictures: this.productForm.get("PicturesArray").value
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
  }
  removePicture(index: number) {
    (<FormArray>this.productForm.get('PicturesArray')).removeAt(index);
  }
  onFileChange(event) {
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
          let picControl = new FormControl(reader.result);
          (<FormArray>this.productForm.get('PicturesArray')).push(picControl);
          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        };
      } else {


      }
    }
  }

  validImages() {
    return (<FormArray>this.productForm.get('PicturesArray')).length > 0 && (<FormArray>this.productForm.get('PicturesArray')).length <= 6
  }

}
