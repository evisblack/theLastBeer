import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { MiniJuego1Component } from './Components/Mini-juegos/mini-juego-1/mini-juego-1.component';
import { MiniJuego2Component } from './Components/Mini-juegos/mini-juego-2/mini-juego-2.component';
import { RegistroComponent } from './Components/registro/registro.component';
import { NearbyBarsComponent } from './Components/nearby-bars/nearby-bars.component';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, children: [
        { path: '', component: NearbyBarsComponent },
        { path: 'register', component: RegistroComponent },
        { path: 'login', component: LoginComponent },
      ]},
    //{ path: 'home', component: HomeComponent },
    { path: 'mini-juego-1', component: MiniJuego1Component },
    { path: 'mini-juego-2', component: MiniJuego2Component }
];
