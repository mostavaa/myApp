import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth-guard.service';
import { JwtHelper } from 'angular2-jwt';
import { CustomersComponent } from './customers/customers.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppRouting } from 'src/app/routing.module';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './home/home.component';
import { DepartmentService } from './services/dept.service';
import { DepartmentsComponent } from './departments/departments.component';
import { ListDepartmentsComponent } from './departments/list-departments/list-departments.component';
import { NewDepartmentComponent } from './departments/new-department/new-department.component';
import { ProductsComponent } from './products/products.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { ProductComponent } from './products/product/product.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { ProductsService } from './services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from './services/http.service';
import { FooterComponent } from './footer/footer.component';
import { CRUDService } from './services/CRUD.service';


@NgModule({ 
  declarations: [
    AppComponent, LoginComponent, CustomersComponent, NotFoundComponent, NavigationMenuComponent, HomeComponent, DepartmentsComponent, ListDepartmentsComponent, NewDepartmentComponent, 
    ProductsComponent, ListProductsComponent, ProductComponent, CreateProductComponent, FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRouting,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [JwtHelper, AuthGuard, AuthService , DepartmentService,ProductsService,HttpService,CRUDService],
  bootstrap: [AppComponent]
})
export class AppModule { }
