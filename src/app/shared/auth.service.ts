import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
    const storedUser = localStorage.getItem('currentUser');
    const parsedUser = storedUser ? JSON.parse(storedUser).result.user : null;
    this.currentUserSubject = new BehaviorSubject<any>(parsedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}Users/login`, { username, password })
      .pipe(map(response => {
        // Guarda los detalles del usuario en local storage para mantener la sesión
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response.result.user);
        return response;
      }));
  }

  logout() {
    // Elimina el usuario del local storage y establece currentUserSubject a null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(user: any) {
    return this.http.post<any>(`${this.apiUrl}Users/registro`, user);
  }
}
