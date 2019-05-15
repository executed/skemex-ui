import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {Office} from './office.model';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service.d';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../auth.service";
import {LogInComponent} from "../log-in/log-in.component";

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']
})
export class OfficeComponent implements OnInit {
  private offices: Office[];
  private officeId: number;
  private submitted: boolean = true;
  private officeName: String;
  message: string;
  form: FormGroup;
  modalRef: BsModalRef;
  @ViewChild(LogInComponent) logInComponent;

  constructor(private appService: AppService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private authService: AuthService) {
  }


  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [null, [Validators.required, Validators.pattern("[a-zA-Z0-9]+[a-zA-Z0-9 -]*")]]
    });
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern("[a-zA-Z0-9]+[a-zA-Z0-9 -]*")]],
      timeZone: [null, [Validators.required, Validators.pattern("[a-zA-Z0-9]+[a-zA-Z0-9 -]*")]],
      city: [null, [Validators.required, Validators.pattern("[a-zA-Z0-9]+[a-zA-Z0-9 -]*")]]
    });
    this.appService.getOffices().subscribe(
      data => {
        this.offices = data.data;
        console.log(this.offices);
      }
    );
  }


  openDelModal(template: TemplateRef<any>, officeId: number, officeName: String) {
    event.stopPropagation();
    this.officeId = officeId;
    this.modalRef = this.modalService.show(template);
    this.officeName = officeName
  }

  deleteOffice(officeId) {
    officeId = this.officeId;
    console.log(officeId);
    this.appService.deleteOffice(officeId).subscribe(
      data => {
        let index = this.offices.findIndex(x => x.id == officeId);
        this.offices.splice(index, 1);
        this.modalRef.hide();
      }
    );

  }

  get formOffice() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    const office = new Office();
    office.city = this.form.value.city;
    office.name = this.form.value.name;
    office.timeZone = this.form.value.timeZone;
    if (this.form.valid) {
      this.appService.createOffice(office).subscribe(data => {
        this.offices.push(data.data);
        this.modalRef.hide();
      })
    } else {
      this.submitted = false;
      return;
    }
  }
}
