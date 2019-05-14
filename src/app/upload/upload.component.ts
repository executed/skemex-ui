import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadService } from './upload.service';
import { forkJoin } from 'rxjs';
import {hasOwnProperty} from 'tslint/lib/utils';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @ViewChild('file') file;

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  public selectedFile: File;
  constructor(public uploadService: UploadService) {}

  progress;
  uploading = false;
  errorMessage = '';

  ngOnInit() {}

  onFilesAdded() {
    this.selectedFile = this.file.nativeElement.files[0];
    this.progress = null;
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  doUpload() {
    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.selectedFile);
    console.log(this.progress);
    for (const key in this.progress) {
      if (hasOwnProperty(this.progress, key)) {
        this.progress[key].progress.subscribe(val => console.log(val));
      }
    }

    // convert the progress map into an array
    const allProgressObservables = [];
    for (const key in this.progress) {
      if (hasOwnProperty(this.progress, key)) {
        allProgressObservables.push(this.progress[key].progress);
      }
    }

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(
         end => {
          // ... and the component is no longer uploading
          this.uploading = false;
          location.href = './';
      },
        error => {
           this.uploading = false;
           this.errorMessage = 'Uploading Excel file failed!';
      });
  }
}
