import {FormGroup} from '@angular/forms';
import {AppService} from '../../app.service';
import {map} from 'rxjs/operators';
import {Reservation} from '../workspace.model';
import {DatePipe} from '@angular/common';


export class DateValidatorBackEnd {
  static isAvailable(appService: AppService, workspaceId: number, datePipe: DatePipe) {
    return (form: FormGroup) => {
      const model = new Reservation();
      model.endTime = datePipe.transform(form.controls.endDate.value, 'yyyy-MM-dd');
      model.startTime = datePipe.transform(form.controls.startDate.value, 'yyyy-MM-dd');
      model.workspaceId = workspaceId;
      return appService.isTimeForRequestAvailable(model)
        .pipe(map(res => {
          console.log(res.data);
          return res.data ? null : {DateForRequestIsBusy: true};
        }));
    };
  }
}
