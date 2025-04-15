import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity';
import { ParticipationRequest } from 'src/app/models/participationRequest';
import { User } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService
  ) {
    this.participationForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    });
  }

  ngOnInit(): void {
    const activityId = +this.route.snapshot.paramMap.get('id')!;
    const userId = 1; // Static for demo

    // Fetch activity
    this.activityService.getActivityById(activityId).subscribe({
      next: (data) => {
        this.activity = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching activity details:', err);
        this.error = 'Erreur lors du chargement de l\'activité.';
        this.isLoading = false;
      }
    });

    // Fetch user
    this.userService.getUserById(userId).subscribe({
      next: (data) => {
        this.user = data;
        if (this.user) {
          this.participationForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            telephone: this.user.telephone,
          });
        }
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.error = 'Erreur lors du chargement des informations de l\'utilisateur.';
      }
    });
  }

  onSubmit(): void {
    if (this.participationForm.invalid || !this.user || !this.activity) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide ou données manquantes.',
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const formValues = this.participationForm.value;
  
    const participationRequest: ParticipationRequest = {
      activityId: this.activity.id!,
      userId: 1, // Static user ID (you can make this dynamic later)
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      telephone: Number(formValues.telephone),
    };
  
    this.activityService.participateInActivity(participationRequest).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Participation réussie!',
          text: response,
          showConfirmButton: true,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/visiteur/activities/list-visiteur']); // ✅ Updated path
        });
      },
      error: (err) => {
        console.error('Participation error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la participation.',
          text: err.error,
          showConfirmButton: true,
          confirmButtonText: 'OK'
        });
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/visiteur/activities/list-visiteur']);
  }
  
  
}
