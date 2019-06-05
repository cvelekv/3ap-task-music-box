import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotReleasesComponent } from './hot-releases.component';

describe('HotReleasesComponent', () => {
  let component: HotReleasesComponent;
  let fixture: ComponentFixture<HotReleasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotReleasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
