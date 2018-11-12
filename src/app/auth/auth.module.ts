import { TokenInterceptor } from './../services/tokenInterceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations:[RegisterComponent,LoginComponent],
    imports:[CommonModule , ReactiveFormsModule , AuthRoutingModule],
    providers:[{
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }]
})
export class AuthModule{

}