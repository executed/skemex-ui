import {AbstractControl} from '@angular/forms';

export class StartDateValidator {
  static validate(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    const now = new Date(Date.now());
    now.setHours(0, 0, 0, 0);
    if (control.value < now) {
      return {
        startTimeAfterNow: true
      };

    }
    return null;
  }
}
