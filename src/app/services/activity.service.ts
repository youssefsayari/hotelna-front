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

  private baseUrl = 'http://localhost:8095/activity';

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
  participateInActivity(activityId: number, userId: number): Observable<string> {
    const url = `${this.baseUrl}/participate/${activityId}/${userId}`;
  
    return this.http.post(url, null, {
      responseType: 'text'
    });
  }
  

  getActivityStatistics(): Observable<ActivityStats> {
    return this.http.get<ActivityStats>(`${this.baseUrl}/stats`);
  }
  
  
}
