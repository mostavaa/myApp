import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { CustomersComponent } from "./customers/customers.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AuthGuard } from "./guard/auth-guard.service";
import { HomeComponent } from "./home/home.component";
import { DepartmentsComponent } from "./departments/departments.component";
import { NewDepartmentComponent } from "./departments/new-department/new-department.component";
import { ProductsComponent } from "./products/products.component";
import { ProductComponent } from "./products/product/product.component";
import { CreateProductComponent } from "./products/create-product/create-product.component";
import { ListProductsComponent } from "./products/list-products/list-products.component";

const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'departments/edit/:elId', component: NewDepartmentComponent },
    { path: 'departments/new/:id', component: NewDepartmentComponent },
    { path: 'departments/new', component: NewDepartmentComponent },
    {
        path: 'products', component: ProductsComponent, children: [
            { path: ':deptId/:id/edit', component: CreateProductComponent },
            { path: ':deptId/new', component: CreateProductComponent },
            { path: ':deptId/:id', component: ProductComponent },
            { path: ':deptId', component: ListProductsComponent },
        ]
    },
    { path: 'products', redirectTo: '/products/all', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },

    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' }
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRouting {

}