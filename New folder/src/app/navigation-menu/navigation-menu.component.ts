import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DepartmentService } from '../services/dept.service';
import { Department } from '../models/department.model';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})
export class NavigationMenuComponent implements OnInit {

  constructor(
   
    private authService: AuthService,
  ) { }

  isUserAuthenticated() {
    return this.authService.isUserAuthenticated();
  }

  ngOnInit(){
  }
  showNav=true;
  toggleMenu(){
    this.showNav = !this.showNav;
  }
  hideNav(){
    this.showNav = false;
  }
}
