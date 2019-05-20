import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-youtubeplayer',
  templateUrl: './youtubeplayer.component.html',
  styleUrls: ['./youtubeplayer.component.css']
})
export class YoutubeplayerComponent{

  id = 'qDuKsiwS5xw';
  private player;
  private ytEvent;

  constructor() {

  }
  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

}
