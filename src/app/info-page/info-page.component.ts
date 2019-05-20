import { Component, OnInit } from '@angular/core';
import {InfoPageService} from "./infopage.service";

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  private infoDocURL: string;
  private infoDocVisible: boolean = false;
  private infoVideoVisible: boolean = false;
  private infoDocToggleBtnText = 'Watch info document';
  private infoVideoToggleBtnText = 'Watch info video';

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

  private toggleInfoDocVisibility(): void {
    this.infoDocVisible = !this.infoDocVisible;
    this.infoDocToggleBtnText = (this.infoDocVisible) ? 'Close info document' : 'Watch info document';
  }

  private toggleInfoVideoVisibility(): void {
    this.infoVideoVisible = !this.infoVideoVisible;
    this.infoDocToggleBtnText = (this.infoDocVisible) ? 'Close info document' : 'Watch info document';
  }

}
