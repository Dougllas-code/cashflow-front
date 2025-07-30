import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly horizontalPosition: MatSnackBarHorizontalPosition = "right";
  private readonly verticalPosition: MatSnackBarVerticalPosition = "top";
  private readonly seconds: number = 5;

  constructor(private readonly snackBar: MatSnackBar) { }

  public create(message: string): void {
    this.snackBar.open(`${message}`, undefined, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.seconds * 1000,
    });
  }


}