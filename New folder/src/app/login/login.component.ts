import { Component, OnInit, ViewChild, asNativeElements } from '@angular/core';
import {HttpClient , HttpHeaders} from '@angular/common/http';
import {NgForm } from '@angular/forms';
import {Router}from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalidLogin: boolean =false;
  constructor(private router: Router,private http: HttpClient) { }

  ngOnInit() {
  }

  @ViewChild('username')username:any;
  @ViewChild('password')password:any;

  login( ) {
      let credentials = JSON.stringify({username:this.username.nativeElement.value , password:this.password.nativeElement.value});
      this.http.post("https://localhost:44324/api/auth/login", credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe(response => {
        let token = (<any>response).token;
        localStorage.setItem("jwt", token);
        this.invalidLogin = false;
        this.router.navigate(["/"]);
      }, err => {
        this.invalidLogin = true;
      });
    }
}
