import { Component, OnInit } from '@angular/core';
import {InfoPageService} from "./infopage.service";

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  private infoDocURL: string;

  constructor(private infoPageService: InfoPageService) { }

  ngOnInit() {
    this.requestDocURL();
  }

  private requestDocURL(): void {
    this.infoPageService.infoDocURLRequest().subscribe( data => {
        this.infoDocURL = data.data;
      }
    )
  }

}
