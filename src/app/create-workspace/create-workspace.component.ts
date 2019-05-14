import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CreateWorkspaceModel} from './create-workspace.model';
import {CdkDragEnd, CdkDragMove, CdkDragStart} from '@angular/cdk/typings/esm5/drag-drop';
import {RoomComponent} from '../room/room.component';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {Reservation} from '../workspace/workspace.model';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.css',
    '../room/room.component.css']
})
export class CreateWorkspaceComponent implements OnInit {
  @Input() workspace: CreateWorkspaceModel;
  @Input() lightRooms: number[];
  @Input() editable: boolean;
  @Input() isSomethingChanged: boolean;
  @ViewChild('place') place;
  @Output() deleteRow: EventEmitter<any> = new EventEmitter<any>();
  @Output() somethingEdited: EventEmitter<any> = new EventEmitter<any>();
  workspaceName: string;
  public reservations: Array<Reservation> = [];
  private status;

  constructor(private appService: AppService, private router: Router) {
  }

  ngOnInit() {
    this.workspace.isDeletable = true;
    console.log(this.workspace.isDeletable);
    switch (this.workspace.status) {
      case 'FREE': {
        this.workspaceName = 'FREE';
        this.status = 'workplace-3';
        if (this.workspace.id !== undefined) {
          this.getReservations();
        }
        break;
      }
      case 'BUSY': {
        this.workspaceName = this.workspace.firstName + ' ' + this.workspace.lastName;
        this.status = 'workplace-1';
        this.workspace.isDeletable = false;
        break;
      }
      default: {
        this.workspaceName = 'FEDIA';
        this.status = 'workplace-6';
        break;
      }
    }
    if (this.lightRooms && this.lightRooms.includes(this.workspace.id)) {
      this.status += ' lightSpace';
    }
  }

  redirect() {
    this.router.navigate(['./workspace/' + this.workspace.id]);
  }

  dragStarted(event: CdkDragStart) {
  }

  dragEnded(event: CdkDragEnd) {
    const str = this.place.nativeElement.style.transform;
    const match = str.match('^.*?\\((-?\\d+)px, (-?\\d+)px,');
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    console.log(x);
    console.log(y);
    this.workspace.x += (x / RoomComponent.elementView.nativeElement.offsetWidth) * 100;
    this.workspace.y += (y / RoomComponent.elementView.nativeElement.offsetHeight) * 100;
    console.log(this.workspace.x);
    event.source.reset();
  }

  dragMoved(event: CdkDragMove) {
    this.somethingEdited.emit();
  }

  removeWorkspace(id: number) {
    this.somethingEdited.emit();
    this.deleteRow.emit();
  }

  private getReservations() {
    this.appService.getReservationToWorkspace(this.workspace.id).subscribe(
      data => {
        this.reservations = data.data;
        for (const i of this.reservations) {
          if (i.requestStatus === 'OPEN') {
            this.workspace.isDeletable = false;
          }
          if (i.requestStatus === 'ACTIVE' || i.requestStatus === 'APPROVED') {
            this.workspace.isDeletable = false;
            this.status = 'workplace-2';
            this.workspaceName = 'RESERVED';
            if (this.lightRooms && this.lightRooms.includes(this.workspace.id)) {
              this.status += ' lightSpace';
            }
            if (i.requestStatus === 'ACTIVE') {
              this.appService.getEmployeeByNickname(i.employeeNickname).subscribe(
                data1 => {
                  const employee = data1.data;
                  this.workspaceName = employee.firstName + ' ' + employee.lastName;
                  this.workspace.organizationName = employee.organizationName;
                }
              );
            }
          }
        }
      }
    );
  }
}
