import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Product } from '../../models/Product';
import { ProductsService } from '../../services/products/product.service';

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
    private productService: ProductsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["guid"]) {
        this.guid = params["guid"];
        this.editMode = true;
        let product = this.productService.getByGuid(this.guid);
        if (product) {
          this.product = product;
        }
      } else {
        this.editMode = false;
      }
      if (params["departmentGuid"])
        this.departmentGuid = params["departmentGuid"];
      this.initForm();
    })
  }

  initForm() {
    let nameControl = new FormControl(this.product ? this.product.name : null, [Validators.required, Validators.minLength(3)]);
    let descriptionControl = new FormControl(this.product ? this.product.description : null, [Validators.required, Validators.minLength(3)]);
    let PictureControl = new FormControl(this.product ? this.product.picture : null, [Validators.required]);
    let PriceControl = new FormControl(this.product ? this.product.price : null, [Validators.required]);

    this.productForm = new FormGroup({
      Name: nameControl,
      Description: descriptionControl,
      Picture: PictureControl,
      Price: PriceControl
    })
  }
  delete() {
    let res = confirm("are you sure you want to delete this product !?");
    if (res) {
      //this.departmentService.delete(this.departmentGuid);
    }
  }
  onSubmit() {
    let product: Product = {
      departmentGuid: this.departmentGuid,
      description: this.productForm.get("Description").value,
      name: this.productForm.get("Name").value,
      picture: this.productForm.get("Picture").value,
      price: this.productForm.get("Price").value,
      guid: this.guid,
      likes: 0
    }

    if (this.editMode) {
      //this.productService.edit(product);
    } else {
      //this.productService.add(product);
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
