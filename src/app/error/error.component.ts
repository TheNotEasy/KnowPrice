import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  @Input() callback: (() => void) | null = null;

  constructor() { }

  ngOnInit() {
    if (!this.callback) {
      this.callback = () => {}
    }
  }
}
