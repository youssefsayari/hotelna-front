import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint} from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
    private baseUrl = 'http://localhost:8090/innoxpert/complaint'; // URL du backend Spring Boot

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

  // UPDATE
  updateComplaint(id: number, complaintDetails: Complaint): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.baseUrl}/updateComplaint/${id}`, complaintDetails);
  }

  // DELETE
  deleteComplaint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteComplaint/${id}`);
  }
}