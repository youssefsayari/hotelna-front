import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Restaurant} from "../models/restaurant";

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private baseUrl = 'http://localhost:8095/restaurants';

  constructor(private http: HttpClient) {}

  addRestaurant(newRestaurant: Restaurant): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${this.baseUrl}/add-restaurant`, newRestaurant);
  }

  getAllRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.baseUrl}/retrieve-all-restaurants`);
  }

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.baseUrl}/retrieve-restaurant/${id}`);
  }

  updateRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.baseUrl}/update-restaurant`, restaurant);
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-restaurant/${id}`);
  }


}
