import { Component } from '@angular/core';
import { NearbyBarsComponent } from '../nearby-bars/nearby-bars.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NearbyBarsComponent,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) { }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }


}
