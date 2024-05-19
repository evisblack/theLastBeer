import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.css']
})
export class CardInfoComponent {
  @Input() bars: any[] = [];

  getTodaySchedule(openingHours: any): string {
    if (!openingHours || !openingHours.weekday_text) {
      return 'N/A';
    }
    const today = new Date().getDay();
    return openingHours.weekday_text[today];
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
      if (i < rating) {
        stars.push({ type: 'filled' });
      } else {
        stars.push({ type: 'empty' });
      }
    }
    return stars;
  }
}
