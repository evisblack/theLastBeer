import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NearbyBarsComponent } from './Components/nearby-bars/nearby-bars.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'google-places-app';
}
