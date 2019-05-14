import {Component, OnInit, TemplateRef, wtfCreateScope} from '@angular/core';
import {AppService} from '../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Floor} from './floor.model';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service.d';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from "../auth.service";
import {ValidateFloor} from "./validators/ValidateFloor";
import {Room} from "../rooms/rooms.model";
import {Employee} from "../create-workspace/create-workspace.model";
import {ValidateNickname} from "../workspace/validators/NicknameValidator";


@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css']
})

export class FloorComponent implements OnInit {

  officeId: number;
  private floors: Array<Floor>;
  private floorId: number;
  private stageTitle = '';
  private submitted: boolean = false;
  form: FormGroup;
  modalRef: BsModalRef;


  constructor(
    private appService: AppService,
    private router: Router,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activateRoute: ActivatedRoute) {
    this.officeId = activateRoute.snapshot.params['officeId'];
  }

  selectedFloor: Floor;

  onSelect(floor: Floor): void {
    this.selectedFloor = floor;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      number: [null, Validators.required],
    }, {asyncValidator: ValidateFloor.isFloorAvailable(this.appService, this.officeId)});
    this.appService.getFloors(this.officeId).subscribe(
      data => {
        this.floors = data.data;
        if (this.floors !== undefined && this.floors.length === 0) {
          this.stageTitle = 'No floors';
        }
        this.selectedFloor = this.floors[0];
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openDelModal(template: TemplateRef<any>, floreId: number) {
    event.stopPropagation();
    this.floorId = floreId;
    this.modalRef = this.modalService.show(template);
  }


  deleteFloor(floorId) {
    floorId = this.floorId;
    console.log(floorId);
    this.appService.deleteFloor(floorId).subscribe(
      data => {
        let index = this.floors.findIndex(x => x.id == floorId);
        this.floors.splice(index, 1);
        this.ngOnInit();
        this.modalRef.hide();
      }
    );

  }
  get formFloor() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    const floor = new Floor();
    floor.number = this.form.value.number;
    console.log(this.form.status + "+++++++++++++++");
    floor.officeId = this.officeId;
    if(this.form.valid) {
      this.appService.createFloor(floor).subscribe(data => {
        this.floors.push(data.data);
        this.ngOnInit();
        this.modalRef.hide();
      })
    }else {
      return;
    }
  }
}
