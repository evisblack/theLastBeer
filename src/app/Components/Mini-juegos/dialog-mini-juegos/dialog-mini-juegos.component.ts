import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-mini-juegos',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './dialog-mini-juegos.component.html',
  styleUrl: './dialog-mini-juegos.component.css'
})
export class DialogMiniJuegosComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogMiniJuegosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  cerrar() {
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close('repeat');
  }

}
