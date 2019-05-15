import {Injectable} from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {ErrorLog} from "./error-log";
import {AuthService} from "../auth.service";
import {Observable} from "rxjs";

@Injectable()
export class ErrorsService {
  private errorReportURL = `${environment.apiUrl}/errors`;

  private static errorReportURL = `${environment.apiUrl}/errors`;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private location: LocationStrategy) {}
  log(error) {
    let url = this.location instanceof PathLocationStrategy ? this.location.path() : '';
    const currentUser = this.authService.getCurrentUser();
    const err = new ErrorLog(error, url, currentUser.nickname);
    this.http.post(this.errorReportURL, err).subscribe();
  }

  public static parseErrorLogEntity(responseInstance): ErrorLog {
    const errorLog: ErrorLog = new ErrorLog(new Error(''), '', '');
    errorLog.fullId = responseInstance.id;
    errorLog.name = responseInstance.name;
    errorLog.url = responseInstance.url;
    errorLog.status = responseInstance.status;
    errorLog.message = responseInstance.message;
    errorLog.username = responseInstance.username;
    errorLog.time = responseInstance.time;
    return errorLog;
  }

  private reportError(error: ErrorLog) {
    console.log('Sending error report to ' + ErrorsService.errorReportURL);
    this.http.post(ErrorsService.errorReportURL, error).subscribe();
  }

  public errorLogsRequest(): Observable<any> {
    return this.http.get(ErrorsService.errorReportURL);
  }

  public deleteRequest(id): void {
    this.http.delete(ErrorsService.errorReportURL + '/' + id).subscribe();
  }

  public errorLogLocationRequest(id): Observable<any> {
    return this.http.get(ErrorsService.errorReportURL + '/location' + '?id=' + id);
  }



  public static normalizeTime(time: string): string {
    time = time + '';
    const charArr: string[] = time.split(',');
    return charArr[2] + '/' + charArr[1] + '/' + charArr[0];
  }
}
