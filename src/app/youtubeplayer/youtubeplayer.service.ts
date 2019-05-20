import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class YoutubeplayerService {

  private static infoVideoIdRequestURL = `${environment.apiUrl}/info/infoVideoId`;

  constructor(private http: HttpClient) {}

  public infoDocURLRequest(): Observable<any> {
    return this.http.get(YoutubeplayerService.infoVideoIdRequestURL);
  }
}
