import { ICurrentUser, IErrorMessage } from './../../services/models';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup
  returnUrl = "";
  constructor(private AuthService: AuthService,
    private route: ActivatedRoute,
    private router: Router

  ) {

  }

  ngOnInit() {
    if (this.AuthService.isLogged())
      this.router.navigate([""]);
    this.AuthService.loginSubject.subscribe((currentUser: ICurrentUser) => {
      this.router.navigate([this.returnUrl]);
    })

    if (this.route.snapshot.queryParams["returnUrl"]) {
      this.returnUrl = this.route.snapshot.queryParams["returnUrl"]
    }
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })
  }
  ngOnDestroy() {
  }

  onSubmit() {
    this.AuthService.login(
      <ICurrentUser>{
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      });
  }

}
