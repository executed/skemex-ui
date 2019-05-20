import { TestBed } from '@angular/core/testing';

import { YoutubeplayerService } from './youtubeplayer.service';

describe('YoutubeplayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YoutubeplayerService = TestBed.get(YoutubeplayerService);
    expect(service).toBeTruthy();
  });
});
