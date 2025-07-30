import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-primary-button',
  template: `
    <button
      role="button"
      mat-flat-button
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      background-color: #b0b0b0 !important;
      color: #000 !important;
    }
    button:disabled {
      background-color: #9e9e9e;
      color: #bdbdbd;
    }
  `],
  imports: [MatButtonModule]
})
export class PrimaryButtonComponent {
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<Event>();
}