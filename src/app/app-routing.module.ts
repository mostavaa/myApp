import { ListProductsComponent } from './products/list-products/list-products.component';
import { DetailsProductComponent } from './products/details-product/details-product.component';
import { CreateEditProductComponent } from './products/create-edit-product/create-edit-product.component';
import { CreateEditDepartmentComponent } from './departments/create-edit-department/create-edit-department.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:"", redirectTo:"/products" , pathMatch:"full"},
  {path:"createDepartment/:parentGuid/create",component:CreateEditDepartmentComponent},
  {path:"createDepartment/:departmentGuid/edit",component:CreateEditDepartmentComponent},
  {path:"createProduct/:departmentGuid",component:CreateEditProductComponent},
  {path:"editProduct/:departmentGuid/:guid",component:CreateEditProductComponent},
  {path:"products/:departmentGuid/:guid",component:DetailsProductComponent},
  {path:"products/:departmentGuid",component:ListProductsComponent},
  {path:"products",component:ListProductsComponent},
  {path:'auth',loadChildren:'./auth/auth.module#AuthModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
