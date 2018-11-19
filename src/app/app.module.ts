import { DepartmentService } from './services/departments/department.service';
import { TokenInterceptor } from './services/tokenInterceptor.service';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListDepartmentsComponent } from './departments/list-departments/list-departments.component';
import { HeadersComponent } from './shared/headers/headers.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { CreateEditProductComponent } from './products/create-edit-product/create-edit-product.component';
import { DetailsProductComponent } from './products/details-product/details-product.component';
import { CreateEditDepartmentComponent } from './departments/create-edit-department/create-edit-department.component';
import { DetailsDepartmentComponent } from './departments/details-department/details-department.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductsService } from './services/products/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MinStrLengthPipe } from './min-str-length.pipe';
import { TranslatePipe } from './translate.pipe';
@NgModule({
  declarations: [
    AppComponent,
    ListDepartmentsComponent,
    HeadersComponent,
    ListProductsComponent,
    CreateEditProductComponent,
    DetailsProductComponent,
    CreateEditDepartmentComponent,
    DetailsDepartmentComponent,
    FooterComponent,
    MinStrLengthPipe,
    TranslatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [DepartmentService, ProductsService, AuthService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {

}
