import { Component, OnInit } from '@angular/core';
import { Card } from '../../../models/card.model';
import { Router } from '@angular/router';
import { PuntuacionService } from '../../../shared/puntuacion.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMiniJuegosComponent } from '../dialog-mini-juegos/dialog-mini-juegos.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mini-juego-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-juego-2.component.html',
  styleUrl: '../mini-juegos-styles.css'
})
export class MiniJuego2Component implements OnInit{

  cards: Card[] = [];
  selectedCards: Card[] = [];
  tiempoRestante: number = 10;
  private intervalId: number | null = null;
  puntuacion: number= 0;

  images = ['../../../assets/img/barman.png', '../../../assets/img/barra-de-bar.png', '../../../assets/img/cerveza.png', '../../../assets/img/salud.png'];

  constructor(private dialog: MatDialog, private router: Router, private puntuacionService: PuntuacionService) {}
  
  ngOnInit(): void {
    this.initializeGame();
  }

  initializeGame() {
    this.cards = [];
    this.puntuacion = 0;
    this.tiempoRestante = 10;

    this.images.forEach((image, index) => {
      this.cards.push({ id: index * 2, image, revealed: false, matched: false });
      this.cards.push({ id: index * 2 + 1, image, revealed: false, matched: false });
    });

    this.cards = this.shuffle(this.cards);
    this.startTimer();
  }

  shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    this.puntuacionService.setPuntuacion(this.puntuacion); 
    const dialogRef = this.dialog.open(DialogMiniJuegosComponent, {
      data: {puntuacion : this.puntuacion},
      width: '300px',
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result === 'repeat'){
        this.initializeGame();
        this.router.navigate(['/mini-juego-2']);
      }
      else{
        this.router.navigate(['/']       
        );
      }
      
    });
  }

  selectCard(card: Card) {
    if (card.revealed || card.matched || this.selectedCards.length === 2) {
      return;
    }

    card.revealed = true;
    this.selectedCards.push(card);

    if (this.selectedCards.length === 2) {
      this.checkForMatch();
    }
  }

  checkForMatch() {
    const [card1, card2] = this.selectedCards;

    if (card1.image === card2.image) {
      card1.matched = true;
      card2.matched = true;
      this.puntuacion += 150;

      if (this.cards.every(card => card.matched)) {
        clearInterval(this.intervalId);
        this.openDialog();
      }
    } else {
      setTimeout(() => {
        card1.revealed = false;
        card2.revealed = false;
      }, 1000);
    }

    this.selectedCards = [];
  }


}
