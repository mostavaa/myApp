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
import { FooterComponent } from './shared/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductsService } from './services/products/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MinStrLengthPipe } from './min-str-length.pipe';
import { TranslatePipe } from './translate.pipe';
import { AuthGuard } from './services/guards/auth.guard';
import { HttpService } from './services/http.service';
import { DialogBodyComponent } from './shared/dialog-body/dialog-body.component';
import { MatDialogModule } from '@angular/material';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  declarations: [
    AppComponent,
    ListDepartmentsComponent,
    HeadersComponent,
    ListProductsComponent,
    CreateEditProductComponent,
    DetailsProductComponent,
    CreateEditDepartmentComponent,
    FooterComponent,
    MinStrLengthPipe,
    TranslatePipe,
    DialogBodyComponent,
  ],
  entryComponents: [DialogBodyComponent]
  ,
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    Ng4LoadingSpinnerModule.forRoot() 
  ],
  providers: [
    HttpService,
    AuthGuard,
    DepartmentService, ProductsService, AuthService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {

}
