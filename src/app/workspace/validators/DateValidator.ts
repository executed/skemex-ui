import {FormGroup} from '@angular/forms';

export class DateValidator {
  static validate(form: FormGroup) {

    let start = form.controls.startDate.value;
    let end = form.controls.endDate.value;
    if (!end) {
      return null;
    }
    if (end > start) {
      return null;
    }
    return {
      startTimeAfterEndTime: true
    };

  }
}
