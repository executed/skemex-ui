import {AppService} from "../../app.service";
import {FormGroup} from "@angular/forms";
import { map} from "rxjs/operators";
export class ValidateFloor{
   static isFloorAvailable(appService: AppService, officeId : number) {
    return (form: FormGroup) => {
      return appService.isFloorAvailable(form.controls.number.value, officeId).pipe(
        map(res => {
        return res.data ? null : {floorExist: true};
      }));
    };
  }
}
