import { ListProductsComponent } from './products/list-products/list-products.component';
import { DetailsProductComponent } from './products/details-product/details-product.component';
import { CreateEditProductComponent } from './products/create-edit-product/create-edit-product.component';
import { CreateEditDepartmentComponent } from './departments/create-edit-department/create-edit-department.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  { path: "", redirectTo: "/products", pathMatch: "full" },
  { path: "createDepartment/:parentGuid/create", component: CreateEditDepartmentComponent, canActivate: [AuthGuard] },
  { path: "createDepartment/:departmentGuid/edit", component: CreateEditDepartmentComponent, canActivate: [AuthGuard]},
  { path: "createProduct/:departmentGuid", component: CreateEditProductComponent, canActivate: [AuthGuard]},
  { path: "editProduct/:departmentGuid/:guid", component: CreateEditProductComponent, canActivate: [AuthGuard]},
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
