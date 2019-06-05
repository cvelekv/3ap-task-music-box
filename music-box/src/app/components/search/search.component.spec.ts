import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AppModule } from '../../app.module';
import { DialogComponent } from './../dialog/dialog.component';
import { SearchComponent } from './search.component';

describe("SearchComponent", () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let fixture2: ComponentFixture<DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Search button should be disabled when search value is empty.", () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("button"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it("Search button should enable when search value is inserted.", () => {
    component.searchValue = "Michael";
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css(".button-color"));
    expect(button.nativeElement.disabled).toBeFalsy();
  });
});
