import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RatingDTO } from '../models/rating-dto';
import { Rating } from '../models/rating';



@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8088/restaurants/rating';

  constructor(private http: HttpClient) { }

  addRating(rating: RatingDTO): Observable<RatingDTO> {
    return this.http.post<RatingDTO>(`${this.apiUrl}/add-rating`, rating);
  }

  getAllRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/get-all-ratings`);
  }

  getRatingsByRestaurantId(restaurantId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/get-ratings-by-restaurant/${restaurantId}`);
  }

  getRatingById(ratingId: number): Observable<Rating> {
    return this.http.get<Rating>(`${this.apiUrl}/retrieve-rating/${ratingId}`);
  }
}
