import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'myApp';
  lang: string;
  navBarOpended: boolean = false;
  constructor(private authService: AuthService) {

  }
  ngOnInit() {
    let lang = this.authService.getLanguage();
    this.lang = lang == "en" ? "ar" : "en";

  }
  changeLanguage() {
    this.authService.setLanguage(this.lang);
    location.reload();
  }
  logout() {
    this.authService.logout();
  }
  isLogged() {
    return this.authService.isLogged();
  }
  toggleMenu() {
    this.navBarOpended = !this.navBarOpended;
  }
}
