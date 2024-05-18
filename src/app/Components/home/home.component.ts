import { Component } from '@angular/core';
import { NearbyBarsComponent } from '../nearby-bars/nearby-bars.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NearbyBarsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


}
