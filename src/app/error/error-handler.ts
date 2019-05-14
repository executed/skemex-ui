import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {ErrorsService} from "./error.service";


@Injectable()
export class ErrorsHandler implements ErrorHandler {

  constructor(private injector: Injector) {
  }

  handleError(error: any): void {
    const errorService = this.injector.get(ErrorsService);
    if (error instanceof HttpErrorResponse) {
      console.log('Handling HttpErrorResponse...');
      this.handleHttpError(error);
    } else {
      console.log('Some client error');
      console.log(error);
      errorService.log(error);
    }
  }

  private handleHttpError(error: HttpErrorResponse) {
    const router = this.injector.get(Router);
    console.log('Server responded with error; Status: '
      + error.error.status + ', Message: '
      + error.error.messageList[0].field
      + ': ' + error.error.messageList[0].text);
    router.navigate(['error']);
  }
}
