import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant, Status } from '../../../models/restaurant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-restaurant',
  templateUrl: './update-restaurant.component.html',
  styleUrls: ['./update-restaurant.component.css']
})
export class UpdateRestaurantComponent implements OnInit {
  restaurantForm: FormGroup;
  restaurantId: number = 0;
  statusOptions = Object.values(Status);

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.restaurantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      typeRestaurant: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(30)]],
      openTime: ['', Validators.required],
      closeTime: ['', Validators.required],
      statut: ['', Validators.required]
    }, { validator: this.timeValidator });
  }

  ngOnInit(): void {
    this.restaurantId = +this.route.snapshot.paramMap.get('id')!;
    this.loadRestaurant();
  }

  loadRestaurant(): void {
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (restaurant: Restaurant) => {
        this.restaurantForm.patchValue({
          name: restaurant.name,
          typeRestaurant: restaurant.typeRestaurant,
          description: restaurant.description,
          openTime: restaurant.openTime,
          closeTime: restaurant.closeTime,
          statut: restaurant.statut
        });
      },
      error: (error) => {
        console.error('Error loading restaurant', error);
        Swal.fire('Erreur', 'Impossible de charger les informations du restaurant', 'error');
        this.router.navigate(['/admin/restaurants']);
      }
    });
  }

  timeValidator(group: FormGroup): { [key: string]: any } | null {
    const openTime = group.get('openTime')?.value;
    const closeTime = group.get('closeTime')?.value;
    
    if (openTime && closeTime && openTime >= closeTime) {
      return { timeInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.restaurantForm.valid) {
      const updatedRestaurant: Restaurant = {
        id: this.restaurantId,
        ...this.restaurantForm.value
      };

      this.restaurantService.updateRestaurant(updatedRestaurant).subscribe({
        next: () => {
          Swal.fire({
            title: 'Succès!',
            text: 'Le restaurant a été mis à jour avec succès.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.router.navigate(['/admin/restaurants']);
          });
        },
        error: (error) => {
          console.error('Error updating restaurant', error);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du restaurant', 'error');
        }
      });
    }
  }

  // Getters pour accéder facilement aux contrôles du formulaire
  get name() { return this.restaurantForm.get('name'); }
  get typeRestaurant() { return this.restaurantForm.get('typeRestaurant'); }
  get description() { return this.restaurantForm.get('description'); }
  get openTime() { return this.restaurantForm.get('openTime'); }
  get closeTime() { return this.restaurantForm.get('closeTime'); }
  get statut() { return this.restaurantForm.get('statut'); }
}
