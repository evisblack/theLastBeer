import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogMiniJuegosComponent } from '../dialog-mini-juegos/dialog-mini-juegos.component';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../../shared/puntuacion.service';

@Component({
  selector: 'app-mini-juego-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-juego-1.component.html',
  styleUrl: '../mini-juegos-styles.css'
})
export class MiniJuego1Component implements OnInit{
  colors: string[] = ['red', 'blue', 'green', 'blueviolet'];
  textColors: string[] = ['red', 'blue', 'green', 'blueviolet'];
  selectedColorIndex: number = 0;
  correctColorIndex: number = 0;
  tiempoRestante: number = 10;
  private intervalId: number | null = null;
  acierto: boolean= false;
  error: boolean= false;
  puntuacion: number= 0;
  userId: number | null = null;


  colores: any[]= [
    {
      id:1,
      texto: 'rojo',
      color:'red'
    },
    {
      id:2,
      texto: 'azul',
      color:'blue'
    },
    {
      id:3,
      texto: 'verde',
      color:'green'
    },
    {
      id:4,
      texto: 'amarillo',
      color:'#bfb600'
    }
  ]

  constructor(private dialog: MatDialog, private router: Router, private puntuacionService: PuntuacionService) {}

  ngOnInit() {
    this.startTimer();
    this.userId = this.getUserIdFromLocalStorage();
  }

  getUserIdFromLocalStorage(): number | null {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser?.result?.user?.id || null;
    }
    return null;
  }

  ngOnDestroy() {
    this.clearTimer();
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
  }

  openDialog(): void {
    localStorage.setItem('puntuacion', this.puntuacion.toString());
    // Guardar la puntuación en el backend si hay un usuario logeado
    if(this.userId){
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
      data: {puntuacion : this.puntuacion},
      width: '300px',
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result === 'repeat'){
        this.tiempoRestante = 10;
      this.puntuacion = 0;
        this.startTimer();
        this.router.navigate(['/mini-juego-1']);
      }
      else{
        this.router.navigate(['/']       
        );
      }
      
    });
  }

  pickRandomColor() {
    this.correctColorIndex = Math.floor(Math.random() * this.colors.length);
    this.selectedColorIndex = Math.floor(Math.random() * this.textColors.length);
  }

  seleccionColor(){
    this.correctColorIndex = Math.floor(Math.random() * this.colores.length);
    this.selectedColorIndex = Math.floor(Math.random() * this.colores.length);
  }

  checkAnswer(id: number) {
    this.acierto= false;
    this.error= false;
    if (id === this.correctColorIndex ) {
      this.puntuacion += 100;
      this.acierto= true;
    } else {
      this.error= true;
    }
    this.seleccionColor();
  }

}
