import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  id = '';
  deptId: string;
  productForm: FormGroup;
  uploadedFile: string | ArrayBuffer = null;
  editMode = false;
  editedProduct: Product
  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.productForm = new FormGroup({
      Name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      Description: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      Picture: new FormControl(null, [Validators.required]),
      Price: new FormControl(null, [Validators.required])
    })
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params["id"];
        this.deptId = params["deptId"];
        if (this.id) {
          this.editMode = true;
          this.editedProduct = this.productService.getById(this.id)

          if (this.editedProduct) {
            this.productForm.patchValue(
              {
                "Name": this.editedProduct.Name,
                "Description": this.editedProduct.Description,
                "Picture": this.editedProduct.PicturePath,
                "Price": this.editedProduct.Price,
              })
              this.uploadedFile=this.editedProduct.PicturePath;
          }
        }
      }
    )
  }
  onSubmit() {
    //console.log(this.productForm);

    let product = new Product(
      this.productForm.value.Name,
      this.productForm.value.Description,
      this.productForm.value.Picture,
      +this.productForm.value.Price,
      0,
      0,
      this.deptId
      , null);


    if (this.editMode) {
      this.productService.edit(product, this.id)
    } else {
      this.productService.addNew(product)
    }
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
          this.productForm.patchValue({
            Picture: reader.result
          });
          this.uploadedFile = reader.result;
          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        };
      } else {

      }

    }
  }



}
