import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {Restaurant} from "../../../models/restaurant";
import {RestaurantService} from "../../../services/restaurant.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css']
})
export class AddRestaurantComponent implements OnInit{
  restaurantForm!: FormGroup;

  constructor(private fb: FormBuilder, private restaurantService: RestaurantService,private router: Router) {}

  ngOnInit(): void {
    this.restaurantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      typeRestaurant: ['', [Validators.required]],
      openTime: ['', [Validators.required]],
      closeTime: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.restaurantForm.invalid) {
      return;
    }
    const newRestaurant: Restaurant = this.restaurantForm.value;
    this.restaurantService.addRestaurant(newRestaurant).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Restaurant has been added successfully!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/admin/restaurants']);
        });
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add restaurant. Please check your input!',
          footer: error.message
        });
      }
    });

  }


  get name() {
    return this.restaurantForm.get('name');
  }

  get description() {
    return this.restaurantForm.get('description');
  }

  get typeRestaurant() {
    return this.restaurantForm.get('typeRestaurant');
  }

  get openTime() {
    return this.restaurantForm.get('openTime');
  }

  get closeTime() {
    return this.restaurantForm.get('closeTime');
  }
}
