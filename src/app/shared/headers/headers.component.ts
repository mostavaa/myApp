import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Constants } from '../../services/constants';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  showNav = true;

  constructor(private authService: AuthService,
    private http:HttpClient
    ) { }

  ngOnInit() {
  }
  logout() {
    this.authService.logout();
  }
  isLogged(){ 
    return this.authService.isLogged();
  }
  getValues(){
    this.http.get(Constants.websiteEndPoint+"/values").subscribe(res=>{
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
