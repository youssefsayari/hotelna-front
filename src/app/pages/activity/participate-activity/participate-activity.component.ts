import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participate-activity',
  templateUrl: './participate-activity.component.html',
  styleUrls: ['./participate-activity.component.css']
})
export class ParticipateActivityComponent implements OnInit {
  activity: Activity | null = null;
  user: User | null = null;
  isLoading = true;
  error = '';
  participationForm: FormGroup;

  constructor(
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.participationForm = new FormGroup({
      firstName: new FormControl({ value: '', disabled: true }, Validators.required),
      lastName: new FormControl({ value: '', disabled: true }, Validators.required),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      telephone: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern('[0-9]+')]),
    });
  }

  ngOnInit(): void {
    const activityId = +this.route.snapshot.paramMap.get('id')!;
    this.loadUserProfile(); // Load user profile from local storage
     const idUser: number = this.user?.idUser!; // Ideally fetch from AuthService


    this.activityService.getActivityById(activityId).subscribe({
      next: (data) => {
        this.activity = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching activity:', err);
        this.error = 'Erreur lors du chargement de l\'activité.';
        this.isLoading = false;
      }
    });

    this.userService.getUserById(idUser).subscribe({
      next: (data) => {
        this.user = data;
        this.participationForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          telephone: this.user.telephone,
        });
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.error = 'Erreur lors du chargement des informations de l\'utilisateur.';
      }
    });
  }

   loadUserProfile() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No user data found in local storage.'
        });
      }
    }

  onSubmit(): void {
    if (!this.user || !this.activity) {
      Swal.fire({
        icon: 'warning',
        title: 'Utilisateur ou activité introuvable.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const activityId = this.activity.id!;
    const userId = this.user.idUser!;
  
    this.activityService.participateInActivity(activityId, userId).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Participation réussie!',
          text: response, // Backend response message
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/visiteur/activities/list-visiteur']);
        });
      },
      error: (err) => {
        // If the backend sends a message (e.g., activity not found, user already participated)
        const errorMessage = err.error || 'Une erreur inconnue est survenue.';
        
        // Show the error message from backend
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la participation',
          text: errorMessage, // Display backend message
          confirmButtonText: 'OK'
        });
      }
    });
  }
  

  goBack(): void {
    this.router.navigate(['/visiteur/activities/list-visiteur']);
  }
}
