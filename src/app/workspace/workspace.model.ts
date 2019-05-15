import {AbstractControl} from '@angular/forms';

export class Project {
  id: Number;
  name: string;
  ownerNickname: Number;
  parentName: Number;
}

export class Reservation {
  id: Number;
  requestStatus: string;
  employeeNickname: string;
  approverNickname: string;
  requesterNickname: string;
  workspaceId: number;
  workspaceNumber: number;
  roomTitle: string;
  requestedTime: Date;
  startTime: any;
  endTime: any;
  description: string;
  deleteOldWorkspace: boolean;
}
