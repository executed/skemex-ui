import {Component, Input, OnChanges, SimpleChanges, TemplateRef} from '@angular/core';
import {AppService} from '../app.service';
import {Room} from './rooms.model';
import {Floor} from '../floor/floor.model';
import {ActivatedRoute} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service.d';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnChanges {
  officeId: number;

  constructor(private appService: AppService,
              private activateRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private authService: AuthService) {
    this.officeId = activateRoute.snapshot.params['officeId'];
  }

  message: string;
  form: FormGroup;
  private rooms: Room[];
  modalRef: BsModalRef;
  private count: Number;
  private roomId: Number;
  private submitted: boolean = true;
  private roomTitle: string;
  @Input() floor: Floor;

  ngOnChanges(changes: SimpleChanges) {
    this.form = this.formBuilder.group({
      title: [null, [Validators.required, Validators.pattern("[a-zA-Z0-9]+[a-zA-Z0-9 -]*")]]
    });
    if (this.floor === undefined) {
      return;
    }
    this.appService.getRooms(this.floor.id).subscribe(
      data => {
        this.count = data.data.length;
        this.rooms = data.data;
        console.log((this.rooms.length === 0) ? '' : this.rooms);
        const stageTitle = document.getElementsByClassName('stage-title').item(0);
        if (this.rooms !== undefined && this.rooms.length !== 0) {
          stageTitle.textContent = 'Floor ' + this.floor.number;
        } else {
          stageTitle.textContent = 'No rooms';
        }
        for (const i of this.rooms) {
          if (i.spaceSize <= 5) {
            i.type = 'small-room';
          } else if (i.spaceSize <= 10) {
            i.type = 'standart-room';
          } else {
            i.type = 'large-room';
          }
          console.log(i.type);
        }
      }
    );
  }

  get formRoom() {
    return this.form.controls;
  }

  openModal(template: TemplateRef<any>) {
    event.stopPropagation();
    this.modalRef = this.modalService.show(template);
  }


  openDelModal(template: TemplateRef<any>, roomId: number, roomTitle: string) {
    event.stopPropagation();
    this.roomId = roomId;
    console.log(roomTitle);
    this.modalRef = this.modalService.show(template);
    this.roomTitle = roomTitle;
  }

  deleteRoom(roomId) {
    roomId = this.roomId;
    console.log(roomId);
    this.appService.deleteRoom(roomId).subscribe(
      data => {
        const index = this.rooms.findIndex(x => x.id === roomId);
        console.log(index);
        this.rooms.splice(index, 1);
        this.modalRef.hide();
        this.ngOnChanges(data);
      }
    );

  }

  onSubmit() {
    this.submitted = true;
    const room = new Room();
    room.title = this.form.value.title;
    room.floorId = this.floor.id;
    room.type = 'small-room';
    if (this.form.valid) {
      this.appService.createRoom(room).subscribe(data => {
        this.rooms.push(data.data);
        console.log(room);
        this.modalRef.hide();
        this.ngOnChanges(data);
      })
    } else {
      this.submitted = false;
      return;
    }
  }
}
