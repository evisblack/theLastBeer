import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PuntuacionService {
  private puntuacion: number = 0;

  setPuntuacion(puntuacion: number): void {
    this.puntuacion = puntuacion;
  }

  getPuntuacion(): number {
    return this.puntuacion;
  }
}
