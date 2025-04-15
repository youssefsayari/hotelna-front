import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chambre, EtatChambre } from '../models/chambre';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private baseUrl = 'http://localhost:8095/chambre'; 

  constructor(private http: HttpClient) {}

  
  createChambre(chambre: Chambre): Observable<Chambre> {
    return this.http.post<Chambre>(`${this.baseUrl}/add`, chambre);
  }

  
  getChambreById(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.baseUrl}/get/${id}`);
  }

  getAllChambres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.baseUrl}/all`);
  }
  

  
  getChambresParEtat(etat: EtatChambre): Observable<Chambre[]> {
    const params = new HttpParams().set('etat', etat);
    return this.http.get<Chambre[]>(`${this.baseUrl}/etat`, { params });
  }

  updateChambre(chambre: Chambre): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.baseUrl}/update`, chambre);
  }

  
  deleteChambre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  
  changerEtatChambre(id: number, nouvelEtat: EtatChambre): Observable<Chambre> {
    const params = new HttpParams().set('nouvelEtat', nouvelEtat);
    return this.http.put<Chambre>(`${this.baseUrl}/changer-etat/${id}`, null, { params });
  }

  
  reserverChambre(idChambre: number, idUser: number): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.baseUrl}/reserver/${idChambre}/utilisateur/${idUser}`, null);
  }

  
  nettoyerChambresUtilisateur(idUser: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/nettoyer-chambres/${idUser}`, null);
  }
}
