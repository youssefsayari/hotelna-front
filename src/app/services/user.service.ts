import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model'; // Adjust the path based on where your user model is located

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8090/user'; // Your backend base URL

  constructor(private http: HttpClient) {}

  // Get a user by their ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/getUserById/${id}`);
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getAllUsers`);
  }

  // Add a new user
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/addUser`, user);
  }

  // Delete a user by their ID
  deleteUserById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteUser/${id}`);
  }

  // Update a user's details
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/updateUser`, user);
  }
}
