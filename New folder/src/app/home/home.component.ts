import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DepartmentService } from '../services/dept.service';
import { Department } from '../models/department.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService : AuthService,
    private departmentService: DepartmentService,
  ) { }

  ngOnInit() {
  }
  isUserAuthenticated(){
    return this.authService.isUserAuthenticated();
  }

}
