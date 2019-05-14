import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CreateWorkspaceModel} from '../create-workspace/create-workspace.model';
import {AppService} from '../app.service';
import {ActivatedRoute} from '@angular/router';
import {Room} from '../rooms/rooms.model';
import {AuthService} from '../auth.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service.d';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  static width;
  static elementView: ElementRef;
  public workSpaces: Array<CreateWorkspaceModel> = [];
  private warning: string;
  private roomId;
  form: FormGroup;
  private officeId;
  private roomTitle: String;
  public subscriptions: Subscription[] = [];
  modalRef: BsModalRef;
  private room: Room;
  private editable: boolean;
  @ViewChild('tag') elementView1: ElementRef;
  private lightRooms;
  private isSomethingChanged = false;

  name = 'slideToggle';
  id = 'materialSlideToggle';

  constructor(private appService: AppService,
              private activateRoute: ActivatedRoute,
              private authService: AuthService,
              private modalService: BsModalService) {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required)
    });
    this.roomId = activateRoute.snapshot.params['roomId'];
    this.officeId = activateRoute.snapshot.params['officeId'];
    activateRoute.queryParams.subscribe(data => {
      if (data['workspaces']) {
        this.lightRooms = JSON.parse(data['workspaces']);
        console.log(this.lightRooms);
      }
    });
  }

  public subscribe() {
    this.subscriptions.push(this.modalService.onShow.subscribe(($event: any, reason: string) => {
    }));
    this.subscriptions.push(this.modalService.onShown.subscribe((reason: string) => {
    }));
    this.subscriptions.push(this.modalService.onHide.subscribe((reason: string) => {
      this.leaveWithoutSave();
    }));
    this.subscriptions.push(this.modalService.onHidden.subscribe((reason: string) => {
      this.unsubscribe();
    }));
  }

  public unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  onChange(value: boolean, template1) {
    this.subscribe();
    if (this.isSomethingChanged && !value) {
      this.modalRef = this.modalService.show(template1);
    } else {
      this.isSomethingChanged = false;
      this.editable = value;
    }
  }

  public addWorkSpace() {
    this.isSomethingChanged = true;
    const workspace = new CreateWorkspaceModel();
    workspace.status = 'FREE';
    workspace.roomId = this.room.id;
    workspace.x = 0;
    workspace.y = 0;
    let numberOfNextPlace = this.workSpaces.length + 1;

    for (let j = 0; j < this.workSpaces.length; j++) {
      let flag = false;
      for (let i = 0; i < this.workSpaces.length; i++) {
        if (this.workSpaces[i].number === (j + 1)) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        numberOfNextPlace = j + 1;
        break;
      }
    }
    workspace.number = numberOfNextPlace;
    this.workSpaces.push(workspace);
    if (this.workSpaces.length <= 5) {
      this.room.type = 'small-room';
    } else if (this.workSpaces.length <= 10) {
      this.room.type = 'standart-room';
    } else {
      this.room.type = 'large-room';
    }
  }

  public saveAllWorkspaces() {
    this.isSomethingChanged = false;
    for (const i of this.workSpaces) {
      i.x = i.x * 10000;
      i.y = i.y * 10000;
    }
    this.appService.saveAllWorkspaces(this.workSpaces, this.roomId).subscribe(data => {
      if (this.workSpaces.length <= 5) {
        this.room.type = 'small-room';
      } else if (this.workSpaces.length <= 10) {
        this.room.type = 'standart-room';
      } else {
        this.room.type = 'large-room';
      }

      this.workSpaces = data.data;
      if (this.workSpaces.length === 0) {
        this.warning = 'No workspaces';
      }
      for (const i of this.workSpaces) {
        i.x = i.x / 10000;
        i.y = i.y / 10000;
      }
    });
  }

  ngOnInit() {
    this.editable = false;
    RoomComponent.elementView = this.elementView1;
    this.room = new Room();
    this.room.title = '';
    this.room.type = '';
    this.appService.getRoom(this.roomId).subscribe(
      data => {
        console.log(data.data);
        this.room = data.data;
        if (this.room.spaceSize <= 5) {
          this.room.type = 'small-room';
        } else if (this.room.spaceSize <= 10) {
          this.room.type = 'standart-room';
        } else {
          this.room.type = 'large-room';
        }
        console.log(this.room.type);
      }
    );
    this.getAllWorkspaces();
  }

  getAllWorkspaces() {
    this.appService.getWorkSpacesByRoom(this.roomId).subscribe(
      data => {
        console.log(data.data);
        this.workSpaces = data.data;
        if (this.workSpaces.length === 0) {
          this.warning = 'No workspaces';
        }
        for (const i of this.workSpaces) {
          i.x = i.x / 10000;
          i.y = i.y / 10000;
        }
      }
    );
  }

  openEditModal(template: TemplateRef<any>, roomId: Number, roomTitle: String) {
    event.stopPropagation();
    this.roomId = roomId;
    this.modalRef = this.modalService.show(template);
    this.roomTitle = roomTitle;
  }

  onSubmit(f: NgForm) {
    console.log(f.value);
    const room = new Room();
    room.id = this.roomId;
    room.title = f.value.title;
    if (this.form.valid) {
      this.appService.updateRoom(room).subscribe(data => {
        this.room.title = data.data.title;
        console.log(room);
        this.modalRef.hide();

      });
    }
  }

  onDeleteRow(workspace: CreateWorkspaceModel) {
    const index = this.workSpaces.indexOf(workspace);
    this.workSpaces.splice(index, 1);
  }

  leaveWithoutSave() {
    this.editable = false;
    this.getAllWorkspaces();
    this.modalRef.hide();
  }

  leaveWithSave() {
    this.editable = false;
    this.saveAllWorkspaces();
    this.modalRef.hide();
  }
}
