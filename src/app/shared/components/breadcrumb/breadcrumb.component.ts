import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  template: `
    <nav aria-label="breadcrumb">
      <mat-chip-listbox>
        <mat-chip color="primary" selected class="breadcrumb-chip">{{ appName() }}</mat-chip>
        <mat-icon class="breadcrumb-icon">chevron_right</mat-icon>
        <mat-chip color="accent" selected class="breadcrumb-chip">{{ pageName() }}</mat-chip>
      </mat-chip-listbox>
    </nav>
  `,
  styles: [`
    nav {
      margin-bottom: 16px;
    }
    ::ng-deep mat-chip-listbox .mdc-evolution-chip-set__chips {
      display: flex;
      align-items: center;
    }
    .breadcrumb-chip {
      margin-left: 8px;
      margin-right: 8px;
    }
    .breadcrumb-chip:last-child {
      margin-left: 0;
    }
    .breadcrumb-icon {
      margin-left: 0;
      margin-right: 0;
    }
  `]
})
export class BreadcrumbComponent {
  appName = input<string>('CashFlow');
  pageName = input.required<string>();
}
