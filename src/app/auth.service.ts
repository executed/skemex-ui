import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {User} from './log-in/user';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static readonly userLocalStorageKey = 'currentUser';
  static readonly csrfCookieName = 'XSRF-TOKEN';
  static readonly csrfHeaderName = 'X-XSRF-TOKEN';
  private loginUrl = `${environment.apiUrl}/login`;
  private accountInfoUrl = `${environment.apiUrl}/accountInfo`;
  private logoutUrl = `${environment.apiUrl}/logout`;
  private user: User;

  constructor(private router: Router,
              private http: HttpClient,
              private cookie: CookieService) {
  }

  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('remember-me', String(rememberMe));
    return this.http.post<any>(this.loginUrl, null, {params: params});
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<any>(this.accountInfoUrl).pipe(map(response => {
      sessionStorage.setItem(AuthService.userLocalStorageKey, JSON.stringify(response.data));
      return true;
    }));
  }

  getCsrfToken() {
    return this.http.get(this.loginUrl).subscribe(
      data => {
        console.log(data);

      }
    );
  }

  getCurrentUser(): User {
    const item: any = sessionStorage.getItem(AuthService.userLocalStorageKey);
    const jsonObj: any = JSON.parse(item);
    this.user = <User>jsonObj;
    return this.user;
  }

  isAdmin(): boolean {
    let flag = false;
    if (isNullOrUndefined(this.getCurrentUser())) {
      flag = false;
    } else if (this.getCurrentUser().roles.includes('ROLE_ADMIN')) {
      flag = true;
    }
    return flag;
  }

  logout() {
    this.http.post(this.logoutUrl, null).subscribe(
      () => {
      },
      () => {
        sessionStorage.removeItem(AuthService.userLocalStorageKey);
        this.router.navigate(['/login']);
      },
      () => {
        sessionStorage.removeItem(AuthService.userLocalStorageKey);
        this.router.navigate(['/login']);
      }
    );
  }
}
