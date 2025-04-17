// services/bloc.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bloc } from '../models/bloc';

@Injectable({
  providedIn: 'root',
})
export class BlocService {
  private baseUrl = 'http://localhost:8095/blocs'; // Match your backend URL

  constructor(private http: HttpClient) {}

  // Get all blocs
  getAllBlocs(): Observable<Bloc[]> {
    return this.http.get<Bloc[]>(`${this.baseUrl}/get`);
  }

  // Get a single bloc by ID
  getBlocById(id: number): Observable<Bloc> {
    return this.http.get<Bloc>(`${this.baseUrl}/getById/${id}`);
  }

  // Create a new bloc
  createBloc(bloc: Bloc): Observable<Bloc> {
    return this.http.post<Bloc>(`${this.baseUrl}/add`, bloc);
  }

  // Update an existing bloc
  updateBloc(id: number, bloc: Bloc): Observable<Bloc> {
    return this.http.put<Bloc>(`${this.baseUrl}/update/${id}`, bloc);
  }

  // Delete a bloc
  deleteBloc(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // Get available blocs
  getAvailableBlocs(): Observable<Bloc[]> {
    return this.http.get<Bloc[]>(`${this.baseUrl}/disponibles`);
  }

  // Get occupancy rate for a bloc
  getOccupancyRate(blocId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${blocId}/taux-occupation`);
  }
}