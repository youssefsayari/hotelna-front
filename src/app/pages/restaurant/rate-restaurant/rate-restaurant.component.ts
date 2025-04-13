import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from '../../../services/rating.service';
import { RatingDTO, Rate } from '../../../models/rating-dto';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-rate-restaurant',
  templateUrl: './rate-restaurant.component.html',
  styleUrls: ['./rate-restaurant.component.css']
})
export class RateRestaurantComponent implements OnInit {
  restaurantId!: number;
  rating: RatingDTO = new RatingDTO();
  selectedRate: Rate = Rate.FIVE;
  Rate = Rate;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.restaurantId = +params['id'];
      this.rating.restaurantId = this.restaurantId;
      this.rating.score = this.selectedRate;
    });
  }

  setRating(rate: Rate): void {
    this.selectedRate = rate;
    this.rating.score = rate;
  }

  submitRating(): void {
    if (!this.rating.mail) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez entrer votre email',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (!this.rating.comment) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez ajouter un commentaire',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    console.log(this.rating);
    this.ratingService.addRating(this.rating).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Votre avis a été enregistré avec succès',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/admin/restaurants']);
        });
      },
      error: (error) => {
        console.error('Error submitting rating:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l\'enregistrement de votre avis',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }
}
