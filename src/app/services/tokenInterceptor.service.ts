import { ICurrentUser } from './models';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpErrorResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, finalize, take, switchMap, filter } from "rxjs/operators";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpService } from './http.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private httpService: HttpService, private authService: AuthService, private spinnerService: Ng4LoadingSpinnerService) { }
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    let handling = next.handle(this.addTokenToRequest(request, this.authService.getAuthToken()))
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>err).status) {
              case 401:
                debugger;
                return this.handle401Error(request, next);
              default:
                if (err.error["messages"]) {
                  return throwError(<any>{ res: false, messages: <string[]>err.error.messages });
                }
                return throwError(<any>{ res: false, messages: <string[]>[] });

            }
          } else {
            return throwError(err);
          }
      }),
      finalize(() => {
        this.isRefreshingToken = false;
        this.httpService.requestCounts--;
        this.httpService.requestCounts == 0 ? this.spinnerService.hide() : '';

      })
    )

    return handling;
  }
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      this.tokenSubject.next(null);
      return this.authService.refreshToken({ refreshToken: this.authService.getRefreshToken() })
        .pipe(
          switchMap((currentUser: ICurrentUser) => {
            debugger;

            if (currentUser.accessToken) {
              this.tokenSubject.next(currentUser.accessToken);
              return next.handle(this.addTokenToRequest(request, currentUser.accessToken));
            }
            return <any>this.authService.logout();
          }),
          catchError(err => {
            return <any>this.authService.logout();
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      this.isRefreshingToken = false;
      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
            debugger;
            return next.handle(this.addTokenToRequest(request, token));
          }));
    }
  }
}
