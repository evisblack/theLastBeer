import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { PuntuacionService } from '../../shared/puntuacion.service';
import { CommonModule } from '@angular/common';
import { Ng2GoogleChartsModule, GoogleChartInterface } from 'ng2-google-charts';
import { Score } from '../../models/score.model';
import { FavoriteBarsComponent } from '../favorite-bars/favorite-bars.component';
import { VisitedBarsComponent } from '../visited-bars/visited-bars.component';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  imports: [
    CommonModule,
    Ng2GoogleChartsModule,
    FavoriteBarsComponent,
    VisitedBarsComponent
  ],
  providers:[PuntuacionService]
})
export class EstadisticasComponent implements OnInit {
  currentUser: any;
  loading = true; // Estado de carga
  error = ''; // Estado de error

  chartDataPie: GoogleChartInterface = {
    chartType: 'PieChart',
    dataTable: [],
    options: {
      title: 'Número de juegos jugados',
      is3D: false,
      pieSliceText: 'value',
      colors: ['#B500AE', '#00ADB5', '#ffcb54']
    },
  };

  chartDataLine: GoogleChartInterface = {
    chartType: 'LineChart',
    dataTable: [],
    options: {
      title: 'Puntuaciones de los juegos',
      hAxis: {

      },
      vAxis: {
        title: 'Puntos',
      },
      colors: ['#B500AE', '#00ADB5', '#ffcb54'],
      lineWidth: 5,
      legend: {
        position: 'bottom' // Posiciona la leyenda en la parte inferior
      },
      interpolateNulls: true // Conectar las líneas a pesar de los valores null
    },
  };

  constructor(private authService: AuthService, private scoreService: PuntuacionService) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadScores(user.id);
      }
    });
  }

  loadScores(userId: number) {
    this.loading = true; // Inicia el estado de carga
    this.scoreService.getScoresByUser(userId).subscribe({
      next: (scores: Score[]) => {
        const gameCounts = scores.reduce((acc: { [key: string]: number }, score) => {
          const gameName = score.game.name;
          acc[gameName] = (acc[gameName] || 0) + 1;
          return acc;
        }, {});

        const gameScores = scores.reduce((acc: { [key: string]: { [date: string]: number } }, score) => {
          const gameName = score.game.name;
          const scoreDate = new Date(score.scoreDate).toLocaleDateString();
          if (!acc[gameName]) {
            acc[gameName] = {};
          }
          acc[gameName][scoreDate] = score.points;
          return acc;
        }, {});

        this.chartDataPie.dataTable = [['Juego', 'Veces jugado']];
        this.chartDataPie.dataTable.push(...Object.entries(gameCounts).map(([gameName, count]) => [gameName, count]));

        const dates = [...new Set(scores.map(score => new Date(score.scoreDate).toLocaleDateString()))].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        this.chartDataLine.dataTable = [['Fecha', ...Object.keys(gameScores)]];
        dates.forEach(date => {
          const row: (string | number | null)[] = [date];
          Object.keys(gameScores).forEach(gameName => {
            row.push(gameScores[gameName][date] !== undefined ? gameScores[gameName][date] : null);
          });
          this.chartDataLine.dataTable.push(row);
        });

        this.loading = false; // Finaliza el estado de carga
      },
      error: (err) => {
        this.error = 'Error al cargar las estadísticas'; // Manejo de errores
        this.loading = false; // Finaliza el estado de carga
      }
    });
  }
}
