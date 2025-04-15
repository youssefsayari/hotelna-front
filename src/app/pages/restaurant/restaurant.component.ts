import {Component, OnInit} from '@angular/core';
import {Restaurant} from "../../models/restaurant";
import {RestaurantService} from "../../services/restaurant.service";

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data: Restaurant[]) => {
        this.restaurants = data;
      },
      error: (error:any) => {
        console.error('Error fetching restaurants', error);
      }
    });
  }
}
