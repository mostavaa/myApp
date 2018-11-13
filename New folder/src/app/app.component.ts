import { Component, OnInit } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  isMenuBarOpened: boolean = true;

  constructor(
    private authService: AuthService,
    private jwtHelper: JwtHelper, private router: Router) {
  }

  isUserAuthenticated() {
    return this.authService.isUserAuthenticated();
  }

  logOut() {
    localStorage.removeItem("jwt");
  }
  toggleNavigationMenu(e:any) {
    e.preventDefault();
    this.isMenuBarOpened = !this.isMenuBarOpened;
  }

}