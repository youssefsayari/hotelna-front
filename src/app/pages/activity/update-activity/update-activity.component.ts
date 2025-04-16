import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity';
import { TypeActivity } from 'src/app/models/typeActivity';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-activity',
  templateUrl: './update-activity.component.html'
})
export class UpdateActivityComponent implements OnInit {
  activityForm!: FormGroup;
  activityId!: number;
  typeOptions = Object.values(TypeActivity);
  isLoading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activityForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      typeActivity: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]]
    });
    
    this.activityId = Number(this.route.snapshot.paramMap.get('id'));


    this.fetchActivity();
  }

  fetchActivity(): void {
    this.isLoading = true;
    this.activityService.getActivityById(this.activityId).subscribe({
      next: (activity) => {
        this.activityForm.patchValue(activity);
        this.isLoading = false;
      },
      error: () => {
        this.error = "Erreur lors du chargement de l'activité.";
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      const updatedActivity: Activity = { id: this.activityId, ...this.activityForm.value };
  
      this.activityService.updateActivity(updatedActivity).subscribe({
        next: () => {
          Swal.fire({
            title: 'Succès',
            text: 'Activité mise à jour avec succès!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/admin/activities/list']);
          });
        },
        error: () => {
          Swal.fire('Erreur', "Échec de la mise à jour de l'activité.", 'error');
        }
      });
    }
  }
  // Add these getters to your UpdateActivityComponent class
get name() {
  return this.activityForm.get('name');
}

get typeActivity() {
  return this.activityForm.get('typeActivity');
}

get startDate() {
  return this.activityForm.get('startDate');
}

get startTime() {
  return this.activityForm.get('startTime');
}

get description() {
  return this.activityForm.get('description');
}

get price() {
  return this.activityForm.get('price');
}

get capacity() {
  return this.activityForm.get('capacity');
}
  goBack(): void {
    this.router.navigate(['/admin/activities/list']);
  }
  
  
}
