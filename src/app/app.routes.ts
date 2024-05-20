import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { MiniJuego1Component } from './Components/Mini-juegos/mini-juego-1/mini-juego-1.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'mini-juego-1', component: MiniJuego1Component }
];
