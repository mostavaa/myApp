import { Router } from '@angular/router';
import { ICurrentUser, IErrorMessage } from './models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Constants } from './constants';
import { map, catchError } from "rxjs/operators";
import { Subject } from 'rxjs';
import * as jwt_decode from "jwt-decode";
@Injectable()
export class AuthService {
  loginSubject: Subject<ICurrentUser> = new Subject<ICurrentUser>();
  errorSubject: Subject<IErrorMessage> = new Subject<IErrorMessage>();
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.errorSubject.subscribe((error: IErrorMessage) => {
      alert(error);
    })
  }
  refreshToken(user: ICurrentUser) {
    return this.authorize("/Auth", user);
  }
  login(user: ICurrentUser) {
    this.authorize("/Auth", user);
  }
  register(user: ICurrentUser) {
    this.authorize("/Auth/register", user);
  }
  private authorize(uri: string, user: ICurrentUser) {
    try {
      if (this.isTokenExpired()) {
        let result = this.http.post(Constants.websiteEndPoint + uri, user);
        result.pipe(
          map((res) => {
            return this.mapLogin(res, user)
          }),
          catchError(error => {
            this.errorSubject.next(this.handleError(error));
            return this.errorSubject;
          })
        ).subscribe(res => {
          if (res) {
            debugger;
            let currentUser = <ICurrentUser>res;
            this.setCurrentUser(currentUser);
            this.loginSubject.next(currentUser)
          }
        })
        return result;
      } else {
        this.loginSubject.next(this.getCurrentUser())
      }
    }
    catch (error) {
      let errorMessage = {
        code: 0,
        message: "error",
        serverMessage: "error",
      }
      this.errorSubject.next(errorMessage);
    }
    return null;
  }

  private mapLogin(res: any, currentUser: ICurrentUser) {

    debugger;
    if (res && res["data"]) {
      if (res["status"] == true) {
        
        let User: ICurrentUser = {
          username: currentUser.username,
          accessToken: res.data["accessToken"],
          refreshToken: res.data["refreshToken"]
        }
        return User;
      }
    }
    return null;
  }

  private handleError(error: any) {
    let errorMessage: IErrorMessage;
    if (error["status"]) {
      if (error["status"] == "401") {
        //unauthorized
        errorMessage = {
          code: error["status"],
          message: "un authorized",
          serverMessage: error["message"],
        }
      }
      else if (error["status"] == "400") {
        //bad request
        errorMessage = {
          code: error["status"],
          message: error.error.message,
          serverMessage: error["message"],
        }
      }
      else {
        //server error
        errorMessage = {
          code: error["status"],
          message: "http error",
          serverMessage: error["message"],
        }
      }
    } else {
      //server error
      errorMessage = {
        code: error["status"],
        message: "server error",
        serverMessage: error["message"],
      }
    }
    return errorMessage;
  }

  logout() {
    this.clearCurrentUser();
    this.router.navigate([""]);
  }
  isLogged() {
    return this.getAuthToken() && this.getAuthToken() != "";
  }
  isTokenExpired() {
    let token = this.getAuthToken()
    if (!token || token == "") return true
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) return true;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    if (date === undefined) return true;
    return !(date.valueOf() > new Date().valueOf());
  }
  private clearCurrentUser() {
    localStorage.setItem("currentUser", null);
  }
  private setCurrentUser(currentUser: ICurrentUser) {
    if (currentUser)
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
  private getCurrentUser() {
    let user = localStorage.getItem("currentUser");
    if (user) {
      return <ICurrentUser>JSON.parse(user);
    }
    return null;
  }
  getAuthToken() {
    let user: ICurrentUser = this.getCurrentUser();
    if (user) {
      return user.accessToken;
    }
    return '';
  }
  getRefreshToken() {
    let user: ICurrentUser = this.getCurrentUser();
    if (user) {
      return user.refreshToken;
    }
    return '';
  }

  setLanguage(lang) {
    if (lang)
      localStorage.setItem("language", lang);
  }
  getLanguage() {
    let lang = localStorage.getItem("language");
    if (lang) {
      return (lang);
    }
    return "en";
  }
}
