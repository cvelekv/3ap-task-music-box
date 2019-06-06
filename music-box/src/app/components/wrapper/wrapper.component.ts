import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';

@Component({
  selector: "app-wrapper",
  templateUrl: "./wrapper.component.html",
  styleUrls: ["./wrapper.component.css"]
})
export class WrapperComponent implements OnInit {
  resultObj: any;
  paginationReceived: PageEvent;

  ngOnInit() {}

  setResultObj(obj) {
    this.resultObj = obj;
  }
  paginationSetting(val: PageEvent) {
    this.paginationReceived = val;
  }
}
