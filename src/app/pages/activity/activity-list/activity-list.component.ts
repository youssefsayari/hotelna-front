import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 



@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = [];
  isLoading = true;
  error = '';

  constructor(
    private activityService: ActivityService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching activities:', err);
        this.error = 'Erreur lors du chargement des activités.';
        this.isLoading = false;
      }
    });
  }

  goToUpdate(id: number): void {
    this.router.navigate(['/admin/activities/update', id]);
  }

  deleteActivity(id: number): void {
    // Directly delete the activity without confirmation
    this.activityService.deleteActivity(id).subscribe({
      next: () => {
        // Remove the deleted activity from the list
        this.activities = this.activities.filter(activity => activity.id !== id);
        Swal.fire('Supprimée !', 'Activité supprimée avec succès.', 'success');
      },
      error: () => {
        Swal.fire('Erreur', "Échec de la suppression de l'activité.", 'error');
      }
    });
  }
  goToDetails(id: number): void {
    this.router.navigate(['/admin/activities/details', id]);
  }
  goToAdd(): void {
    this.router.navigate(['/admin/activities/add']);
  }
  goToCalendar(): void {
    this.router.navigate(['/admin/activities/calendar']);
  }
  
  goToActivityStats(): void {
    this.router.navigate(['/admin/activities/stats']);
  }
  
  
  
  
  
  
}
