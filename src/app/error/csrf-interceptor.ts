import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from '../auth.service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('csrf interceptor');
    const methods: string[] = ['GET', 'HEAD', 'TRACE', 'OPTIONS'];
    if (!methods.includes(request.method)) {
      console.log(this.cookieService.getAll());
      let csrfHeader = new HttpHeaders();
      csrfHeader = csrfHeader.set(AuthService.csrfHeaderName,
        this.cookieService.get(AuthService.csrfCookieName));
      const updatedRequest = request.clone({
        headers: csrfHeader,
      });
      return next.handle(updatedRequest);
    }

    return next.handle(request);
  }
}
