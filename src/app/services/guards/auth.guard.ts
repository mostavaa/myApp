
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from "../auth.service";
import { Injectable } from "@angular/core";
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    if (this.authService.isLogged())
      return true;
        this.router.navigate(['/']);
  }
  canActivateChild(
    route: ActivatedRouteSnapshot
    , state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.canActivate(route, state);
  }

}
