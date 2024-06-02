import { Component, OnInit } from '@angular/core';
import { BarService } from '../../shared/bar.service';
import { CommonModule } from '@angular/common';
import { CardInfoComponent } from '../card-info/card-info.component';

@Component({
  selector: 'app-visited-bars',
  standalone: true,
  imports: [
    CommonModule,
    CardInfoComponent
  ],
  templateUrl: './visited-bars.component.html',
  styleUrl: './visited-bars.component.css'
})
export class VisitedBarsComponent implements OnInit{
  visitedBars: any[] = [];
  barDetails: any[] = [];
  userId: number | null = null;

  constructor(private barService: BarService) { }

  ngOnInit(): void {
    this.userId = this.getUserIdFromLocalStorage();
    if (this.userId) {
      this.getVisitedBars(this.userId);
    }
  }

  getUserIdFromLocalStorage(): number | null {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser?.result?.user?.id || null;
    }
    return null;
  }

  getVisitedBars(userId: number): void {
    this.barService.getVisitedBarsByUserId(userId).subscribe((bars: any[]) => {
      this.visitedBars = bars;
      this.visitedBars.forEach(bar => {
        this.getBarDetails(bar.bar.placeId);
      });
    });
  }

    getBarDetails(placeId: string): void {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails({ placeId: placeId }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && details) {
          console.log("details", details);
          this.barDetails.push({ ...details, isFavorite: true });
        }
      });
    }

}
