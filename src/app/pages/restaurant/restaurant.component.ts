import {Component, OnInit} from '@angular/core';
import {Restaurant} from "../../models/restaurant";
import {RestaurantService} from "../../services/restaurant.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  restaurants: Restaurant[] = [];
  isAdmin: boolean = false;
  user: User | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router,private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.checkAdminRole();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No user data found in local storage.'
      });
    }
  }

  checkAdminRole(): void {
    this.isAdmin = this.user?.typeUser === 'Admin';
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

  viewRestaurantDetails(restaurantName: string, restaurantId: number): void {
    sessionStorage.setItem('selectedRestaurantId', restaurantId.toString());
    this.router.navigate(['/admin/restaurants', restaurantName]);
  }

  deleteRestaurant(restaurantId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce restaurant ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.restaurantService.deleteRestaurant(restaurantId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé!',
              text: 'Le restaurant a été supprimé.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#3085d6',
            });
            this.loadRestaurants();
          },
          error: (error) => {
            console.error('Error deleting restaurant', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression du restaurant. Veuillez réessayer.', 'error');
          }
        });
      }
    });
  }


  updateRestaurant(restaurant: Restaurant): void {
    this.router.navigate(['/admin/restaurants/update', restaurant.id]);
  }
}
