import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CardInfoComponent } from '../card-info/card-info.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { PuntuacionService } from '../../shared/puntuacion.service';

@Component({
  selector: 'app-nearby-bars',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule, 
    MatInputModule, 
    FormsModule,
    CardInfoComponent,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './nearby-bars.component.html',
  styleUrls: ['./nearby-bars.component.css']
})
export class NearbyBarsComponent implements OnInit {
  error: string = '';
  radius: number = 500;
  keyword: string = 'Cerveza';
  barDetails: any[] = [];
  bars: google.maps.places.PlaceResult[] = [];
  map: google.maps.Map;
  service: google.maps.places.PlacesService;
  infoWindow: google.maps.InfoWindow;
  loading: boolean = false;
  disabled: boolean = false;
  puntuacion: number = 0;

  constructor(private puntuacionService: PuntuacionService) {}

  ngOnInit(): void {
    this.puntuacion = this.puntuacionService.getPuntuacion();
    console.log("this.puntuacion:", this.puntuacion);
    this.disabled = this.puntuacion <= 500;
  }

  initMap(): void {
    if (navigator.geolocation) {
      this.loading = true;
      this.disabled = true;
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: userLocation,
          zoom: 15
        });

        this.service = new google.maps.places.PlacesService(this.map);
        this.infoWindow = new google.maps.InfoWindow();

        const request: google.maps.places.PlaceSearchRequest = {
          location: userLocation,
          radius: this.radius,
          keyword: this.keyword,
          openNow: true
        };

        this.service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            this.bars = results;
            results.forEach(bar => {
              this.service.getDetails({ placeId: bar.place_id }, (details, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && details) {
                  this.barDetails.push({ ...details, isFavorite: false});
                  this.createMarker(details);
                }
              });
            });
          }
          this.loading = false;
          this.disabled = false;
        });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.loading = false;
      this.disabled = false;
    }
  }

  createMarker(place: google.maps.places.PlaceResult): void {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.service.getDetails({ placeId: place.place_id }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && details) {
          const isOpen = details.opening_hours?.isOpen() ? 'Abierto' : 'Cerrado';
          const isOpenColor = details.opening_hours?.isOpen() ? 'green' : 'red';
          const content = `
            <div>
              <h3>${details.name}</h3>
              <p><strong>Dirección:</strong> ${details.vicinity}</p>
              <p><strong>Horario de cierre:</strong> ${this.getClosingTime(details)}h</p>
              <p><strong style="color:${isOpenColor};">${isOpen}</strong></p>
              <p><strong>Valoración:</strong> ${details.rating ?? 'N/A'}</p>   
              </div>
          `;
          this.infoWindow.setContent(content);
          this.infoWindow.open(this.map, marker);
        }
      });
    });
  }

  getClosingTime(place: google.maps.places.PlaceResult): string {
    if (!place.opening_hours || !place.opening_hours.periods) {
      return 'N/A';
    }
    const today = new Date().getDay();
    const closingTime = place.opening_hours.periods[today]?.close?.time;
    return closingTime ? this.formatTime(closingTime) : 'N/A';
  }

  formatTime(time: string): string {
    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = time.substring(2);
    return `${hours}:${minutes}`;
  }

  isButtonDisabled(){
    return false;
  }
}
