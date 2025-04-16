import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from 'src/app/models/activity';
import { TypeActivity } from 'src/app/models/typeActivity';
import { ActivityService } from 'src/app/services/activity.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css']
})
export class AddActivityComponent implements OnInit {
  activityForm!: FormGroup;
  typeActivityOptions = Object.values(TypeActivity);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.activityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(30)]],
      price: [0, [Validators.required, Validators.min(0)]],
      typeActivity: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]]
    });
  }

  get name() {
    return this.activityForm.get('name');
  }

  get description() {
    return this.activityForm.get('description');
  }

  get starTime() {
    return this.activityForm.get('startTime');
  }

  get startDate() {
    return this.activityForm.get('startDate');
  }

  get typeActivity() {
    return this.activityForm.get('typeActivity');
  }

  get price() {
    return this.activityForm.get('price');
  }

  get capacity() {
    return this.activityForm.get('capacity');
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      const newActivity: Activity = this.activityForm.value;
  
      this.activityService.addActivity(newActivity).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Activité ajoutée avec succès!',
            confirmButtonColor: '#10B981',
          }).then(() => {
            // After the user presses "OK", navigate to the /admin/activities/list page
            this.router.navigate(['/admin/activities/list']);
          });
          this.activityForm.reset();
        },
        error: (err) => {
          console.error('Error adding activity', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Échec de l\'ajout de l\'activité. Veuillez réessayer.',
            confirmButtonColor: '#EF4444',
          });
        }
      });
    }
  }
  goBack(): void {
    this.location.back();  // This will navigate to the previous page in history
  }

  
}
