import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogMiniJuegosComponent } from '../dialog-mini-juegos/dialog-mini-juegos.component';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../../shared/puntuacion.service';

@Component({
  selector: 'app-mini-juego-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-juego-3.component.html',
  styleUrl: '../mini-juegos-styles.css'
})
export class MiniJuego3Component implements OnInit, OnDestroy {
  tiempoRestante: number = 10;
  private intervalId: number | null = null;
  acierto: boolean = false;
  error: boolean = false;
  puntuacion: number = 0;
  userId: number | null = null;
  birraVisible: boolean = false;
  birraX: number = 0;
  birraY: number = 0;
  private timeoutId: number | null = null;

  constructor(private dialog: MatDialog, private router: Router, private puntuacionService: PuntuacionService) {}

  ngOnInit() {
    this.startGame();
    this.userId = this.getUserIdFromLocalStorage();
    sessionStorage.setItem('puntuacion', this.puntuacion.toString());
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  startGame() {
    this.startTimer();
    this.mostrarBirra();
  }

  getUserIdFromLocalStorage(): number | null {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser?.result?.user?.id || null;
    }
    return null;
  }

  startTimer() {
    this.intervalId = window.setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        this.clearTimer();
        this.openDialog();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  openDialog(): void {
    sessionStorage.setItem('puntuacion', this.puntuacion.toString());
    if (this.userId) {
      this.puntuacionService.saveScore(this.puntuacion, 1, this.userId).subscribe({
        next: response => {
          console.log('Puntuación guardada exitosamente', response);
        },
        error: error => {
          console.error('Error al guardar la puntuación', error);
        }
      });
    }

    const dialogRef = this.dialog.open(DialogMiniJuegosComponent, {
      data: { puntuacion: this.puntuacion },
      width: '300px',
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'repeat') {
        this.tiempoRestante = 10;
        this.puntuacion = 0;
        this.startGame();
        this.router.navigate(['/mini-juego-3']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  mostrarBirra() {
    if (this.tiempoRestante > 0) {
      this.birraVisible = true;
      this.birraX = Math.random() * 80; 
      this.birraY = Math.random() * 80;

      this.timeoutId = window.setTimeout(() => {
        this.birraVisible = false;
        this.error = true;
        setTimeout(() => {
          this.error = false;
          this.mostrarBirra();
        }, 1500); // 1.5 segundos entre apariciones de las birras
      }, 2000); // La birra aparece por 1.5 segundos
    }
  }

  golpearBirra() {
    this.puntuacion += 100;
    this.acierto = true;
    this.birraVisible = false;

    setTimeout(() => {
      this.acierto = false;
      this.mostrarBirra();
    }, 1500); // 1.5 seconds between top appearances
  }

}
