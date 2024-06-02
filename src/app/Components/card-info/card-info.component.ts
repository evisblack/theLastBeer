import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { BarService } from '../../shared/bar.service';

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  providers:[BarService],
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.css']
})
export class CardInfoComponent implements OnInit {
  @Input() bars: any[] = [];
  userId: number | null = null;

  constructor(private barService: BarService) {}

  ngOnInit(): void {
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

 
  toggleFavorite(bar: any): void {
    if (!this.userId) {
      alert('Por favor, inicie sesión para marcar como favorito');
      return;
    }

    if (bar.isFavorite) {
      this.barService.removeFavoriteBar(this.userId, bar.id).subscribe({
        next: (response) => {
          bar.isFavorite = false;
          console.log('Bar eliminado de favoritos', response);
        },
        error: (error) => {
          console.error('Error al eliminar bar de favoritos', error);
        }
      });
    } else {
      const favoriteBar = {
        id: 0,
        placeId: bar.place_id,
        name: bar.name,
        userId: this.userId
      };
      this.barService.addFavoriteBar(favoriteBar).subscribe({
        next: (response) => {
          bar.isFavorite = true;
          console.log('Bar añadido a favoritos', response);
        },
        error: (error) => {
          console.error('Error al añadir bar a favoritos', error);
        }
      });
    }
  }

  visitBar(bar: any): void {
    window.open(bar.url, '_blank');
    if (this.userId) {
    const visitedBar = {
      id: 0,
      placeId: bar.place_id,
      name: bar.name,
      userId: this.userId
    };
    this.barService.addOrUpdateVisitedBar(visitedBar).subscribe({
      next: (response) => {
        console.log('Bar marcado como visitado', response);
      },
      error: (error) => {
        console.error('Error al marcar bar como visitado', error);
      }
    });
  }
  }

  getTodaySchedule(openingHours: any): string {
    if (!openingHours || !openingHours.weekday_text) {
      return 'N/A';
    }
    const today = new Date().getDay();
    const correctedDay = today === 0 ? 6 : today - 1;
    return openingHours.weekday_text[correctedDay];
  }

  formatTime(time: string): string {
    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = time.substring(2);
    return `${hours}:${minutes}`;
  }

  getClosingTime(place: any): string {
    if (!place.opening_hours || !place.opening_hours.periods) {
      return 'N/A';
    }
    const today = new Date().getDay();
    const closingTime = place.opening_hours.periods[today]?.close?.time;
    return closingTime ? this.formatTime(closingTime) : 'N/A';
  }
  getWeekdayTextForToday(openingHours: any): string {
    const todayIndex = new Date().getDay(); // 0 para domingo, 1 para lunes, 2 para martes, etc.

    // Si hoy es domingo (0), ajusta el índice para que 0 corresponda a 6 en el arreglo (domingo)
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

    // Obtener el texto correspondiente al día de la semana actual
    const weekdayTextForToday = openingHours.weekday_text[adjustedIndex];

    // Devolver el texto correspondiente al día de la semana actual
    return weekdayTextForToday || 'Horario no disponible para hoy';
  }

  getStars(rating: number): any[] {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push({ type: 'filled' });
      } else if (i < Math.ceil(rating)) {
        stars.push({ type: 'half' });
      } else {
        stars.push({ type: 'empty' });
      }
    }
    return stars;
  }

}
