import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  src = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  constructor() { }

  ngOnInit() {
  }

}
