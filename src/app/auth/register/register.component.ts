import { IErrorMessage, ICurrentUser } from "./../../services/models";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  returnUrl = "";

  constructor(
    private AuthService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.AuthService.isLogged()) this.router.navigate([""]);
    this.AuthService.loginSubject.subscribe((currentUser: ICurrentUser) => {
      this.router.navigate([this.returnUrl]);
    });

    if (this.route.snapshot.queryParams["returnUrl"]) {
      this.returnUrl = this.route.snapshot.queryParams["returnUrl"];
    }
    this.registerForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }
  ngOnDestroy() {}

  onSubmit() {
    this.AuthService.register(<ICurrentUser>{
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    });
  }
}
