import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { TableService } from '../../../services/table.service';
import { RatingService } from '../../../services/rating.service';
import { TableRes } from '../../../models/table-res';
import { Rate, Rating } from '../../../models/rating';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-restaurant',
  templateUrl: './detail-restaurant.component.html',
  styleUrls: ['./detail-restaurant.component.css']
})
export class DetailRestaurantComponent implements OnInit {
  restaurant: any;
  tables: TableRes[] = [];
  ratings: Rating[] = [];
  loading = true;
  isAdmin = false;
  showAddTableModal = false;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private tableService: TableService,
    private ratingService: RatingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedId = sessionStorage.getItem('selectedRestaurantId');
    this.isAdmin = false;
    
    this.restaurantService.getRestaurantById(Number(storedId)).subscribe(
      (data) => {
        this.restaurant = data;
        this.loadTables(Number(storedId));
        this.loadRatings(Number(storedId));
      },
      (error) => {
        console.error('Error loading restaurant:', error);
        this.loading = false;
      }
    );
  }

  loadTables(restaurantId: number): void {
    this.tableService.getTablesByRestaurantId(restaurantId).subscribe(
      (data) => {
        this.tables = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading tables:', error);
        this.loading = false;
      }
    );
  }

  loadRatings(restaurantId: number): void {
    this.ratingService.getRatingsByRestaurantId(restaurantId).subscribe(
      (data) => {
        this.ratings = data.map((r: any) => ({
          ...r,
          rate: Rate[r.rate as keyof typeof Rate]
        }));
        console.log(this.ratings);
      },
      (error) => {
        console.error('Error loading ratings:', error);
      }
    );
  }
  
 

  reserveTable(tableId: number): void {
    const userId = 1;
    this.tableService.reserveTable(tableId, userId).subscribe(
      (data) => {
        this.loadTables(this.restaurant.id);
        Swal.fire({
          title: 'Réservée !',
          text: 'La table a été réservée avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
      },
      (error) => {
        console.error('Erreur lors de la réservation de la table :', error);
        if (error.status === 400 && error.error?.message) {
          Swal.fire({
            title: 'Erreur !',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33',
          });
        } else {
          Swal.fire({
            title: 'Erreur !',
            text: 'Une erreur est survenue lors de la réservation. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33',
          });
        }
      }
    );
  }
  
  deleteTable(tableId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer cette table ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Non, annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tableService.deleteTable(tableId).subscribe(
          () => {
            this.loadTables(this.restaurant.id);
            Swal.fire({
              icon: 'success',
              title: 'Supprimée !',
              text: 'La table a été supprimée avec succès.',
              confirmButtonColor: '#4CAF50',
              confirmButtonText: 'OK',
              background: '#fff',
              color: '#000',
            });
          },
          (error) => {
            console.error('Erreur lors de la suppression de la table :', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression de la table. Veuillez réessayer.',
              confirmButtonColor: '#4CAF50',
              confirmButtonText: 'OK',
              background: '#fff',
              color: '#000',
            });
          }
        );
      }
    });
  }
  
  

  openAddTableModal(): void {
    this.showAddTableModal = true;
  }

  closeAddTableModal(): void {
    this.showAddTableModal = false;
  }

  onTableAdded(): void {
    this.loadTables(this.restaurant.id);
    this.closeAddTableModal();
  }

  calculateAverageRating(): number {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, rating) => acc + (rating.rate + 1), 0);
    return sum / this.ratings.length;
  }
  

  navigateToRating(): void {
    this.router.navigate(['/admin/restaurants/rating', this.restaurant.id]);
  }
}
