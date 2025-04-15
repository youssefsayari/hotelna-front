import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Complaint} from '../models/complaint.model';
import { ComplaintStatus } from '../models/complaint-status.enum'; // Assurez-vous d'importer l'enum
import { ComplaintCategories } from '../models/complaint-categories.enum'; // Importer l'enum ComplaintCategories
import { ComplaintSolutionIA } from '../models/complaint-solution-ia.model'; // Importer le modèle ComplaintSolutionIA


@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
    private baseUrl = 'http://localhost:8095/complaint'; // URL du backend Spring Boot

  constructor(private http: HttpClient) {}

  // CREATE
  createComplaint(complaint: Complaint, userId: number): Observable<Complaint> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<Complaint>(`${this.baseUrl}/addComplaint`, complaint, { params });
  }

  // READ
  getComplaintById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.baseUrl}/getComplaintById/${id}`);
  }

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.baseUrl}/getAllComplaints`);
  }

 // UPDATE avec gestion moderne
updateComplaint(id: number, complaintDetails: Complaint): Observable<Complaint> {
  return this.http.put<Complaint>(
    `${this.baseUrl}/updateComplaint/${id}`, 
    complaintDetails,
    { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }),
      reportProgress: true,
      responseType: 'json'
    }
  ).pipe(
    catchError(this.handleError<Complaint>('updateComplaint'))
  );
}

private handleError<T>(operation = 'operation') {
  return (error: HttpErrorResponse): Observable<T> => {
    console.error(`${operation} failed:`, error);
    const message = error.error?.message || error.message;
    return throwError(() => new Error(message));
  };
}

  // DELETE
deleteComplaint(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/deleteComplaint/${id}`, {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }),
    observe: 'response' // Observe la réponse entière, pas seulement le corps.
  }).pipe(
    map(response => {
      // Si la réponse est 200 ou 204, la suppression a réussi.
      if (response.status === 200 || response.status === 204) {
        console.log(`Complaint ${id} deleted successfully.`);
        return;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const errorMsg = error.error?.message || error.error?.details || error.message || 'Unknown error occurred';
      console.error(`Delete failed for complaint ${id}:`, errorMsg);
      return throwError(() => new Error(errorMsg));
    })
  );
}

  getComplaintsByStatus(status: ComplaintStatus): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(
      `${this.baseUrl}/getComplaintsByStatus/${status}`,
      {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }),
        responseType: 'json'
      }
    ).pipe(
      catchError(this.handleError<Complaint[]>('getComplaintsByStatus'))
    );
  }
// In complaint.service.ts
getComplaintsByUser(userId: number): Observable<Complaint[]> {
  return this.http.get<Complaint[]>(
    `${this.baseUrl}/getComplaintsByUser/${userId}`,
    {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }),
      responseType: 'json'
    }
  ).pipe(
    catchError(this.handleError<Complaint[]>('getComplaintsByUser'))
  );
}
  // --------------------------------------------------------PARITIE IA-----------------------------------------------------------------
generateAiSolution(category: ComplaintCategories, description: string): Observable<any> {
  const params = new HttpParams()
    .set('category', category)
    .set('description', description);

  return this.http.post<any>(
    `${this.baseUrl}/generate-ai-solution`,
    null,
    { params }
  ).pipe(
    catchError(error => {
      let errorMessage = "Erreur de communication avec l'IA";
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
      return throwError(() => new Error(errorMessage));
    })
  );
}
 // Fonction pour récupérer la solution IA d'une réclamation
 getSolutionByComplaint(complaintId: number): Observable<ComplaintSolutionIA> {
  return this.http.get<ComplaintSolutionIA>(
    `${this.baseUrl}/getSolutionByComplaint/${complaintId}`,
    {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    }
  );
}

// Fonction pour accepter la solution IA
acceptSolutionAndAffectToComplaint(complaintId: number, solutionIA: ComplaintSolutionIA): Observable<void> {
  return this.http.post<void>(
    `${this.baseUrl}/acceptSolutionAndAffectToComplaint/${complaintId}`,
    solutionIA,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    }
  );
}
}