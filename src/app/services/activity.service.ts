import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';  
import { ParticipationRequest } from '../models/participationRequest';
import { ActivityStats } from '../models/activity-stats';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private baseUrl = 'http://localhost:8090/activity';

  constructor(private http: HttpClient) {}

  getAllActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/getAllActivities`);
  }

  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.baseUrl}/getActivityById/${id}`);
  }

  addActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${this.baseUrl}/addActivity`, activity);
  }

  updateActivity(activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.baseUrl}/updateActivity/${activity.id}`, activity);
  }
  

  deleteActivity(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteActivity/${id}`);
  }
  participateInActivity(request: ParticipationRequest): Observable<string> {
    const body = {
      userId: request.userId,
      activityId: request.activityId,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      telephone: request.telephone
    };
  
    return this.http.post(`${this.baseUrl}/participate`, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'  // 👈 This tells Angular to treat the response as plain text
    });
  }

  getActivityStatistics(): Observable<ActivityStats> {
    return this.http.get<ActivityStats>(`${this.baseUrl}/stats`);
  }
  
  
}
