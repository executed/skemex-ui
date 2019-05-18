import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {LocationStrategy} from "@angular/common";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";


@Injectable()
export class InfoPageService {

  private static infoDocURLRequestURL = `${environment.apiUrl}/info/infoDocURL`;

  constructor(private http: HttpClient) {}

  public infoDocURLRequest(): Observable<any> {
    console.log(InfoPageService.infoDocURLRequestURL);
    return this.http.get(InfoPageService.infoDocURLRequestURL);
  }
}
