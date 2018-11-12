import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const authRoutes :Routes=[
    {path:'register' , component:RegisterComponent},
    {path:'login' , component:LoginComponent},
]

@NgModule({
    imports:[RouterModule.forChild(authRoutes)],
    exports:[]
})
export class AuthRoutingModule{

}