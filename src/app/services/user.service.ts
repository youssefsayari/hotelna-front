import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8090/innoxpert/user';

  constructor(private http: HttpClient) { }

  getUserById(idUser: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getUserById/${idUser}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAllUsers`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/addUser`, user);
  }

  deleteUserById(idUser: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteUser/${idUser}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/updateUser`, user);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, email);
  }

  verifyOtp(email: string, otp: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/verify-otp`, {email, otp});
  }

  changePassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, {email, newPassword});
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, {email, password});
  }
}
