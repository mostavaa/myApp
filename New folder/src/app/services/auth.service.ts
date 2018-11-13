import { JwtHelper } from "angular2-jwt";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class AuthService {
  private refreshTokenCall;

   tokenSubject:Subject<IUser>
  
  constructor(private jwtHelper: JwtHelper,) {
        this.tokenSubject = new Subject<IUser>();
    }
  isUserAuthenticated() {
    let token: string = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  
  saveTokenInLocalStorage(token , refreshToken) {
let user:IUser={
  token:token,
  refreshToken:refreshToken
}
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken() {
    if (localStorage.getItem('user')) {
      let user:IUser = JSON.parse(localStorage.getItem('user'));
      return this.tokenSubject.next(user);
    }
    
    return this.refreshToken();
  }

  refreshToken() {
    if (!this.refreshTokenCall) {
      // this.refreshTokenCall = this.http.get(refreshTokenURL)
      //   // Maybe a .map() here, it depends how the backend returns the token
      //   .do(this.saveTokenInLocalStorage)
      //   .finally(() => this.refreshTokenCall = null);
    }
    return this.refreshTokenCall;
  }
}
export interface IUser{
  token:string,
  refreshToken:string
}