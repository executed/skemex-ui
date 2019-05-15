import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('Invoking AuthGuard...');
    return this.authService.isAuthenticated().pipe(
      tap(isAuth => {
        console.log(isAuth);
        if (isAuth) {
          console.log("User is authenticated");
          return true;
        }else {
          console.log('User is unauthorized... redirecting to login page...');
          sessionStorage.removeItem(AuthService.userLocalStorageKey);
          this.router.navigate(['/login']);
          return false;
        }
      })
    ).pipe(catchError(err => {
      console.log('User is unauthorized... redirecting to login page...');
      sessionStorage.removeItem(AuthService.userLocalStorageKey);
      this.router.navigate(['/login']);
      return of(err);
    }));
  }
}
