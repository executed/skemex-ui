import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { AppService } from '../app.service';
import { AuthService } from '../auth.service';
import { Conflict } from './conflicts.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-conflicts',
  templateUrl: './conflicts.component.html',
  styleUrls: ['./conflicts.component.css']
})
export class ConflictsComponent implements OnInit {
  public conflicts: Conflict [] = [];
  public conflictsCount: number;

  currentConflict: Conflict;
  currentSource: string;

  modalRef: BsModalRef;
  formInputFloorNumber: FormGroup;
  @ViewChild('inputFloorNumber') inputFloorNumber: ElementRef;

  floorErrorMessage = '';

  constructor(private appService: AppService,
              private authService: AuthService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getMigrationConflicts();
    this.getMigrationConflictsCount();
    this.formInputFloorNumber = this.formBuilder.group({
      floorNumber: ['', Validators.required]
    });
  }

  public getMigrationConflicts() {
    this.appService.getMigrationConflicts(this.authService.getCurrentUser().nickname).subscribe(
      data => {
        this.conflicts = data.data;
      },
      error => {
        console.log(error);
      }
    );
  }

  public getMigrationConflictsCount() {
    this.appService.getMigrationConflictsCount(this.authService.getCurrentUser().nickname).subscribe(
      data => {
        this.conflictsCount = data.data;
      },
      error => {
        console.log(error);
      }
    );
  }

  public resolveConflict(source: string, conflict: Conflict) {

    this.currentConflict = conflict;
    this.currentSource = source;

    if (conflict.roomConflict && source === 'excel') {
      this.modalRef = this.modalService.show(this.inputFloorNumber);
    } else {
      this.submitResolveConflict();
    }
  }

  public submitResolveConflict() {
    if (this.currentConflict.roomConflict) {
      const floor = this.formInputFloorNumber.value.floorNumber;
      this.currentConflict.floorNumber = floor;
    }

    this.appService.resolveConflictById(this.currentSource, this.currentConflict).subscribe(
      data => {
        this.removeResolvedConflict(this.currentConflict.id);
        if (this.modalRef) {
          this.modalRef.hide();
        }
        this.floorErrorMessage = '';
      },
      error => {
        console.log(error);
        this.floorErrorMessage = error.error.messageList[0].text;
      }
    );
  }

  public removeResolvedConflict(id: number) {
    for (let i = 0; i < this.conflicts.length; i++) {
      if (this.conflicts[i].id === id) {
        console.log('remove id ' + i);
        this.conflicts.splice(i, 1);
        this.appService.navConflictsCount = this.conflicts.length;
      }
    }
  }

  public openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template);
  }

  hide() {
    this.modalRef.hide();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
