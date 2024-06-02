import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }

  getFavoriteBarsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}FavouriteBars/getFavouriteBarsByUserId?userId=${userId}`);
  }

  getVisitedBarsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}VisitedBars/getVisitedBarsByUserId?userId=${userId}`);
  }

  addFavoriteBar(favoriteBar: { id: number; placeId: string; name: string; userId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}FavouriteBars/addFavouriteBar`, favoriteBar);
  }

  removeFavoriteBar(userId: number, barId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}FavouriteBars/removeFavouriteBar?userId=${userId}&barId=${barId}`);
  }

  addOrUpdateVisitedBar(visitedBar: { id: number; placeId: string; name: string; userId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}VisitedBars/addOrUpdateVisitedBar`, visitedBar);
  }
}
