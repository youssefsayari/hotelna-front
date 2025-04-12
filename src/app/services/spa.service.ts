import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Spa } from '../models/spa.model';

@Injectable({
  providedIn: 'root'
})
export class SpaService {
  private apiUrl = 'http://localhost:8095/spa';

  constructor(private http: HttpClient) {}

  getAllSpas(): Observable<Spa[]> {
    return this.http.get<Spa[]>(`${this.apiUrl}/getAllSpas`);
  }

  getSpaById(id: number): Observable<Spa> {
    return this.http.get<Spa>(`${this.apiUrl}/getSpaById/${id}`);
  }

  addSpa(spa: Spa): Observable<Spa> {
    return this.http.post<Spa>(`${this.apiUrl}/addSpa`, spa);
  }

  updateSpa(id: number, spa: Spa): Observable<Spa> {
    return this.http.put<Spa>(`${this.apiUrl}/updateSpa/${id}`, spa);
  }

  deleteSpa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteSpa/${id}`);
  }
}
