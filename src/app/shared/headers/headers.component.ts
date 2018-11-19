import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Constants } from '../../services/constants';
import { map, window } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  showNav = true;
  lang
  constructor(private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

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
  getValues() {
    this.http.get(Constants.websiteEndPoint + "/values").subscribe(res => {
      console.log(res);
    })
  }
  toggleMenu() {
    this.showNav = !this.showNav;
  }
  hideNav() {
    this.showNav = false;
  }
}
