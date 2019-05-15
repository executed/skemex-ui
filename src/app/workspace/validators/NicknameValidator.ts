import {FormGroup} from '@angular/forms';
import {AppService} from '../../app.service';
import {map} from 'rxjs/operators';


export class ValidateNickname {
  static isNickNameAvailable(appService: AppService) {
    return (form: FormGroup) => {
      return appService.isPresent(form.controls.firstName.value + form.controls.lastName.value).pipe(map(res => {
        console.log(!res.data);
        return !res.data ? null : {nicknameExist: true};
      }));
    };
  }
}
