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
}
