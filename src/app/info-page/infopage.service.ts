import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {LocationStrategy} from "@angular/common";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";


@Injectable()
export class InfoPageService {

  private static infoDocURLRequestURL = `${environment.apiUrl}/infoDocURL`;

  constructor(private http: HttpClient) {}

  public infoDocURLRequest(): Observable<any> {
    return this.http.get(InfoPageService.infoDocURLRequestURL);
  }
}
