export class CreateWorkspaceModel {
  id: number;
  number: number;
  status: string;
  x: number;
  y: number;
  firstName: string;
  lastName: string;
  nickname: string;
  organizationName: string;
  roomId: Number;
  reserved: boolean;
  isDeletable: boolean;
  checkDelete:boolean;


  constructor() {
    this.reserved = false;
  }
}

export class Employee {
  nickname: string;
  firstName: string;
  lastName: string;
  active: boolean;
  organizationName: string;

  constructor() {
  }
}

export class WorkspaceSearch {
  startDate: string;
  endDate: string;
  project: number;
  employee: string;
  firstElement: number;
  maxElements: number;
  roomId: number;
  withReserved: boolean;
}
