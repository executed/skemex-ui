import { Component, OnInit } from '@angular/core';
import {YoutubeplayerService} from "./youtubeplayer.service";

@Component({
  selector: 'app-youtubeplayer',
  templateUrl: './youtubeplayer.component.html',
  styleUrls: ['./youtubeplayer.component.css']
})
export class YoutubeplayerComponent implements OnInit{

  private videoId: string;
  private player;
  private ytEvent;

  ngOnInit(): void {
    this.requestVideoId();
  }

  constructor(private videoService: YoutubeplayerService) {
  }

  private requestVideoId(): void {
    this.videoService.infoDocURLRequest().subscribe( data => {
        this.videoId = data.data;
        console.log(this.videoId);
      }
    )
  }

  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

}
