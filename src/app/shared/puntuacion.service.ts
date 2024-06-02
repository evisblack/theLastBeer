import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PuntuacionService {
  private puntuacion: number = 0;
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }

  setPuntuacion(puntuacion: number): void {
    this.puntuacion = puntuacion;
  }

  getPuntuacion(): number {
    return this.puntuacion;
  }
  getScoresByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Scores/byUser/${userId}`);
  }
}
