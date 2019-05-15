import {Component, OnInit} from '@angular/core';
import {ErrorLog} from './error-log';
import {NotifierService} from 'angular-notifier';
import {ErrorsService} from './error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private service: ErrorsService,
              private notifierService: NotifierService) {
  }

  public errorLogList: Array<ErrorLog> = new Array<ErrorLog>();
  private locationFormVisible = false;
  private selectedErrorLogLocation: string;

  ngOnInit() {
    this.errorLogsRequest();
  }

  private closeLocationForm(): void {
    this.locationFormVisible = false;
  }

  private normalizeTime(time: string): string {
    return ErrorsService.normalizeTime(time);
  }

  private errorLogsRequest(): void {
    this.service.errorLogsRequest().subscribe(
      data => {
        data.data.forEach(entry => {
          this.errorLogList.push(ErrorsService.parseErrorLogEntity(entry));
        });
        if (this.errorLogList.length === 0) {
          this.notifierService.notify('success', 'No errors found');
        } else {
          const errorLogSize = this.errorLogList.length;
          this.notifierService.notify('default', 'Errors found: ' + errorLogSize);
        }
      }
    );
  }

  private deleteRequest(id, instance): void {
    const index = this.errorLogList.indexOf(instance, 0);
    if (index > -1) {
      this.errorLogList.splice(index, 1);
    }
    this.service.deleteRequest(id);
  }

  private errorLogLocationRequest(id): void {
    this.locationFormVisible = true;
    this.service.errorLogLocationRequest(id).subscribe(
      data => {
        this.selectedErrorLogLocation = data.data;
      }
    );
  }
}
