import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {AppService} from '../app.service';
import {ActivatedRoute} from '@angular/router';
import {CreateWorkspaceModel, Employee} from '../create-workspace/create-workspace.model';
import {Project, Reservation} from './workspace.model';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service.d';
import {AuthService} from '../auth.service';
import {Room} from '../rooms/rooms.model';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DateValidator} from './validators/DateValidator';
import {ValidateNickname} from './validators/NicknameValidator';
import {DateValidatorBackEnd} from './validators/DateValidatorBackEnd';
import {DatePipe} from '@angular/common';
import {StartDateValidator} from './validators/StartDateValidator';
import {el} from "@angular/platform-browser/testing/src/browser_util";


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  formApprove: FormGroup;
  formSetEmployee: FormGroup;
  formSetNewEmployee: FormGroup;
  formAddRequest: FormGroup;
  formAddNewRequest: FormGroup;
  submitted = false;
  private readonly workspaceId: number;
  createEmployee = false;
  modalRef: BsModalRef;
  room: Room = new Room();
  private reservation: Reservation;
  private status: string;
  private selected: boolean;
  private description: string;
  private projects: Project[];
  private employees: Employee[];
  workspaceName: string;
  private workspace: CreateWorkspaceModel = new CreateWorkspaceModel;
  private reservations: Reservation[];
  nicknameExist = false;

  constructor(private appService: AppService,
              private activateRoute: ActivatedRoute,
              private modalService: BsModalService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private datePipe: DatePipe) {
    this.workspaceId = activateRoute.snapshot.params['workSpaceId'];
  }

  ngOnInit() {
    this.formApprove = this.formBuilder.group({
      checkApprove: []
    });

    this.formSetEmployee = this.formBuilder.group({
      organization: ['0', Validators.required],
      employee: ['', Validators.required],
      checkDelete: []
    });

    this.formSetNewEmployee = this.formBuilder.group({
      organization: ['0', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    }, {asyncValidator: ValidateNickname.isNickNameAvailable(this.appService)});
    if (this.authService.isAdmin()) {
      this.formAddRequest = this.formBuilder.group({
        organization: ['0', Validators.required],
        employee: ['0', Validators.required],
        startDate: ['', [Validators.required, StartDateValidator]],
        endDate: [''],
        description: ['']
      }, {
        validator: DateValidator.validate.bind(this),
        asyncValidator: [DateValidatorBackEnd.isAvailable(this.appService, this.workspaceId, this.datePipe)]
      });
    } else {
      this.formAddRequest = this.formBuilder.group({
        startDate: ['', [Validators.required, StartDateValidator]],
        endDate: [''],
      }, {
        validator: DateValidator.validate.bind(this),
        asyncValidator: [DateValidatorBackEnd.isAvailable(this.appService, this.workspaceId, this.datePipe)]
      });
    }
    this.formAddNewRequest = this.formBuilder.group({
      organization: ['0', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      startDate: ['', [Validators.required, StartDateValidator]],
      endDate: [''],
      description: ['']
    }, {
      validator: DateValidator.validate.bind(this),
      asyncValidator:
        [ValidateNickname.isNickNameAvailable(this.appService),
          DateValidatorBackEnd.isAvailable(this.appService, this.workspaceId, this.datePipe)
        ]
    })
    ;

    this.status = 'show';
    this.selected = false;
    this.appService.getWorkSpace(this.workspaceId).subscribe(
      data => {
        this.workspace = data.data;
        this.loadReservations(this.workspace);
        this.loadRoom(this.workspace.roomId);
      }
    );
  }

  get formAddR() {
    return this.formAddRequest.controls;
  }

  get formNewR() {
    return this.formAddNewRequest.controls;
  }

  get formSetE() {
    return this.formSetEmployee.controls;
  }

  get formNewE() {
    return this.formSetNewEmployee.controls;
  }

  loadReservations(workspace: CreateWorkspaceModel) {
    this.workspaceName = this.workspace.status;
    console.log(this.workspace.status);
    if (workspace.status === 'FREE') {
      this.getReservations();
    }
  }

  makeSlotFree() {
    this.status = 'show';
    this.workspace.status = 'FREE';
    this.workspace.nickname = null;
    this.appService.updateWorkspace(this.workspace).subscribe(
      data => {
        this.workspace = data.data;
        console.log(this.workspace);
        this.loadReservations(this.workspace);
      }
    );
  }

  preAddEmployee() {
    this.status = 'employee';
    this.appService.getProjects().subscribe(
      data => {
        this.projects = data.data;
        console.log(this.projects);
        this.selected = false;
      }
    );
  }

  showEmployee(bool: boolean) {
    this.selected = false;
    if (document.getElementById('employeeDiv')) {
      document.getElementById('employeeDiv').hidden = !bool;
    }
    if (document.getElementById('employeeDiv1')) {
      document.getElementById('employeeDiv1').hidden = !bool;
    }
  }

  hide() {
    this.modalRef.hide();
    this.createEmployee = false;
    this.showEmployee(false);
  }

  getEmployees(event) {
    this.showEmployee(true);
    this.appService.getEmployeesByProject(event.target.value).subscribe(
      data => {
        this.employees = data.data;
        console.log(this.employees);
      }
    );
  }


  approve(reservation: Reservation, status: string) {
    reservation.requestStatus = status;
    this.appService.updateReservation(reservation).subscribe(
      data => {
        reservation = data.data;
        console.log(reservation);
        if (reservation.endTime === null && reservation.requestStatus === 'CLOSED') {
          window.location.reload();
        }
        this.getReservations();
      }
    );
  }
  openDescription(template: TemplateRef<any>, description: string) {
    event.stopPropagation();
    this.modalRef = this.modalService.show(template);
    this.description = description;
  }

  openModal(template: TemplateRef<any>) {
    this.submitted = false;
    if (this.authService.isAdmin()) {
      this.formAddRequest.controls['organization'].setValue('');
      this.formAddRequest.controls['employee'].setValue('');
      this.formSetNewEmployee.controls['organization'].setValue('');
      this.formSetEmployee.controls['organization'].setValue('');
      this.formSetEmployee.controls['employee'].setValue('');
      this.formAddNewRequest.controls['organization'].setValue('');
      this.showEmployee(false);
      this.createEmployee = false;
      this.preAddEmployee();
    }
    this.modalRef = this.modalService.show(template);
  }

  onSubmit() {
    console.log(this.formAddRequest.errors);
    this.submitted = true;


    if (this.formAddRequest.invalid) {
      return;
    }
    const reservation = new Reservation();
    reservation.employeeNickname = this.formAddRequest.value.employee;
    reservation.startTime = this.datePipe.transform(this.formAddRequest.value.startDate, 'yyyy-MM-dd');
    reservation.endTime = this.datePipe.transform(this.formAddRequest.value.endDate, 'yyyy-MM-dd');
    reservation.workspaceId = this.workspace.id;
    reservation.description = this.formAddRequest.value.description;
    this.addReservation(reservation);
    this.createEmployee = false;
    this.showEmployee(false);
    this.modalRef.hide();
  }

  addReservation(reservation: Reservation) {
    this.appService.createReservationRequest(reservation).subscribe(
      data => {
        console.log(data.data);
        this.reservations.push(data.data);
      }
    );
  }

  updateWorkspace(workspace: CreateWorkspaceModel) {
    this.appService.updateWorkspace(workspace).subscribe(
      data => {
        console.log(data);
        this.workspace = data.data;
        this.loadReservations(workspace);
      }
    );
  }

  onSubmit2() {
    this.submitted = true;

    if (this.formSetEmployee.invalid) {
      return;
    }
    this.workspace.nickname = this.formSetEmployee.value.employee;
    this.workspace.status = 'BUSY';
    this.workspace.checkDelete = true;
    this.updateWorkspace(this.workspace);
    this.showEmployee(false);
    this.modalRef.hide();
  }

  onSubmit3() {
    this.submitted = true;
    if (!this.formSetNewEmployee.valid) {
      return;
    }
    const employee = new Employee;
    employee.firstName = this.formSetNewEmployee.value.firstName;
    employee.lastName = this.formSetNewEmployee.value.lastName;
    employee.organizationName = this.formSetNewEmployee.value.organization;
    this.appService.createEmployee(employee).subscribe(
      data => {
        this.workspace.nickname = data.data.nickname;
        this.workspace.status = 'BUSY';
        this.updateWorkspace(this.workspace);
      }
    );
    this.showEmployee(false);
    this.modalRef.hide();
  }

  onSubmit4() {
    this.submitted = true;

    console.log(this.formAddNewRequest);
    if (this.formAddNewRequest.invalid) {
      return;
    }
    const employee = new Employee;
    employee.firstName = this.formAddNewRequest.value.firstName;
    employee.lastName = this.formAddNewRequest.value.lastName;
    employee.organizationName = this.formAddNewRequest.value.organization;
    const reservation = new Reservation();
    reservation.startTime = this.datePipe.transform(this.formAddNewRequest.value.startDate, 'yyyy-MM-dd');
    reservation.endTime = this.datePipe.transform(this.formAddNewRequest.value.endDate, 'yyyy-MM-dd');
    reservation.workspaceId = this.workspace.id;
    reservation.description = this.formAddNewRequest.value.description;
    console.log(reservation.description);
    this.appService.createEmployee(employee).subscribe(
      data => {
        reservation.employeeNickname = data.data.nickname;
        this.addReservation(reservation);
      }
    );
    this.showEmployee(false);
    this.modalRef.hide();
  }

  private loadRoom(roomId: Number) {
    this.appService.getRoom(this.workspace.roomId).subscribe(
      data => {
        this.room = data.data;
      }
    );
  }

  private getReservations() {
    this.appService.getReservationToWorkspace(this.workspace.id).subscribe(
      data => {
        this.reservations = data.data;
        console.log(this.reservations);
        for (const i of this.reservations) {
          if (i.requestStatus === 'ACTIVE' || i.requestStatus === 'APPROVED') {
            this.status = 'workplace-2';
            this.workspaceName = 'RESERVED';
          }
        }
      }
    );
  }

  createEmployeeStatus() {
    this.submitted = false;
    this.createEmployee = true;
  }

  isNicknameExist(f: HTMLFormElement) {
    const firstName = f.value.firstName;
    const lastName = f.value.lastName;
    const nickname = firstName + lastName;
    this.appService.isPresent(nickname).subscribe(
      data => {
        console.log(data.data);
        this.nicknameExist = data.data;
      }
    );
    return true;
  }
}
