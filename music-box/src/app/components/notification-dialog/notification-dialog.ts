import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: "notification-dialog",
  templateUrl: "notification-dialog.html",
  styleUrls: ["./notification-dialog.css"]
})
export class NotificationDialog implements OnInit {
  message;
  type;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
  ngOnInit(): void {
    this.message = this.data.msg;
    this.type = this.data.type;
  }
}
