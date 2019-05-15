import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoyoutsComponent } from './home-loyouts.component';

describe('HomeLoyoutsComponent', () => {
  let component: HomeLoyoutsComponent;
  let fixture: ComponentFixture<HomeLoyoutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLoyoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoyoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
