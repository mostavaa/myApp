import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private auth: AuthService;

  constructor(private injector: Injector) {
    this.auth = this.injector.get(AuthService);
  }

  setHeaders(request) {
    return function (token) {
      return request.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth
      .getToken()
      .map(this.setHeaders(request))
      .mergeMap(next.handle)
      .catch(error => {
        if (error.status === 401) {
          return this.auth.refreshToken()
            .map(this.setHeaders(request))
            .mergeMap(next.handle);
        }
        return Observable.throw(error);
      });
  }

}
