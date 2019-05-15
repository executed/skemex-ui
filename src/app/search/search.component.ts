import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../app.service';
import {DateValidator} from '../workspace/validators/DateValidator';
import {EmployeeSearch, RoomSearch} from './search.model';
import {Room} from '../rooms/rooms.model';
import {Employee} from '../create-workspace/create-workspace.model';
import {Project} from '../workspace/workspace.model';
import {Router} from '@angular/router';
import {CreateWorkspaceModel, WorkspaceSearch} from '../create-workspace/create-workspace.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  private rooms: Room[];
  private roomsForSelect: Room[];
  private projects: Project[];
  private status: string;
  private selected: boolean;
  private employees: Employee[];
  private tempEmployees: Employee[];
  private employeeSearch: EmployeeSearch;
  private countOfElement1 = 100;
  private countOfElement = 15;
  private lastElement = 0;
  private lastElement1 = 0;
  private tempRooms: Room[];
  private lastCheckStatusForWithReserved;
  form1: FormGroup;
  private roomSearch: RoomSearch;

  formSearchEmployee: FormGroup;
  submitted = false;
  submitted2 = false;

  constructor(private authService: AuthService,
              private appService: AppService,
              private formBuilder: FormBuilder,
              private router: Router,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.employeeSearch = new EmployeeSearch();
    this.formSearchEmployee = this.formBuilder.group({
      firstName: [],
      lastName: [],
      nickname: [],
      roomId: [],
      organization: [],
      notActive:[]
    });

    this.roomSearch = new RoomSearch();
    this.form1 = this.formBuilder.group({
      countOp: ['>=', Validators.required],
      numberOfCount: [1],
      startDate: ['', Validators.required],
      endDate: [''],
      withReserved: [false],
    }, {validator: DateValidator.validate.bind(this)});
    this.preSearch();
    this.preAddEmployee();
  }

  get f() {
    return this.form1.controls;
  }

  submit2() {
    this.submitted2 = true;
    this.employeeSearch.firstName = this.formSearchEmployee.value.firstName;
    this.employeeSearch.lastName = this.formSearchEmployee.value.lastName;
    this.employeeSearch.nickname = this.formSearchEmployee.value.nickname;
    this.employeeSearch.roomId = this.formSearchEmployee.value.roomId;
    this.employeeSearch.firstElement = 0;
    if(this.formSearchEmployee.value.notActive){
      this.employeeSearch.active = false;
    }
    else {
      this.employeeSearch.active = true;
    }
    this.employeeSearch.organizationName = this.formSearchEmployee.value.organization;
    this.employeeSearch.maxElements = this.countOfElement;
    this.appService.searchEmployee(this.employeeSearch).subscribe(
      data => {
        this.employeeSearch.firstElement += this.countOfElement;
        this.lastElement1 = this.employeeSearch.firstElement;
        console.log(data.data);
        this.employees = data.data;
        this.formSearchEmployee.reset();
      }
    );
  }

  submit1() {
    this.submitted = true;
    if (this.form1.invalid) {
      return;
    }
    this.roomSearch.startDate = this.datePipe.transform(this.form1.value.startDate, 'yyyy-MM-dd');
    this.roomSearch.endDate = this.datePipe.transform(this.form1.value.endDate, 'yyyy-MM-dd');
    this.roomSearch.numberOfCount = this.form1.value.numberOfCount;
    this.roomSearch.withReserved = this.form1.value.withReserved;
    this.lastCheckStatusForWithReserved = this.form1.value.withReserved;
    this.roomSearch.firstElement = 0;
    this.roomSearch.maxElements = this.countOfElement1;
    this.appService.searchRooms(this.roomSearch).subscribe(
      data => {
        this.roomSearch.firstElement += this.countOfElement1;
        this.lastElement = this.roomSearch.firstElement;
        console.log(data.data);
        this.rooms = data.data;
      }
    );
  }

  preSearch() {
    this.status = 'employee';
    this.appService.getAllRooms().subscribe(
      data => {
        this.roomsForSelect = data.data;
        this.selected = false;
      },
      error => {
        console.log(error);
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
      },
      error => {
        console.log(error);
      }
    );
  }
  changeCount() {
    document.getElementById('numberOfCount').hidden = this.form1.controls.countOp.value === 'All';
    document.getElementById('numberOfCount').hidden = this.form1.controls.count.value === 'All';
  }

  @HostListener('scroll', ['$event'])
  onScroll1(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
      this.appService.searchEmployee(this.employeeSearch).subscribe(
        data => {
          if (this.employeeSearch.firstElement === this.lastElement1) {
            this.employeeSearch.firstElement += this.countOfElement;
            this.lastElement1 = this.employeeSearch.firstElement;
            this.tempEmployees = data.data;
            this.employees.push.apply(this.employees, this.tempEmployees);

          }
        }
      );
    }
  }

  redirectToRoom(number: number, id: number) {
    const filter = new WorkspaceSearch();
    filter.firstElement = 0;
    filter.maxElements = 100;
    filter.roomId = id;
    filter.startDate = this.roomSearch.startDate;
    filter.endDate = this.roomSearch.endDate;
    filter.withReserved = this.lastCheckStatusForWithReserved;
    this.appService.searchWorkspaces(filter).subscribe(
      data => {
        const workspaces: CreateWorkspaceModel[] = data.data;
        const temp: number[] = [];
        workspaces.forEach(e => temp.push(e.id));

        this.router.navigate(['./floor/' + number + '/room/' + id], {queryParams: {workspaces: JSON.stringify(temp)}});
      }
    );
  }
}
