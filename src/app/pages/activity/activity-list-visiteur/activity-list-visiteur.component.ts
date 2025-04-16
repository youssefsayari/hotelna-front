import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-list-visiteur',
  templateUrl: './activity-list-visiteur.component.html',
  styleUrls: ['./activity-list-visiteur.component.css']
})
export class ActivityListVisiteurComponent implements OnInit {
  activities: Activity[] = [];
  isLoading = true;
  error = '';

  constructor(private activityService: ActivityService,
    private router: Router  // Inject Router into the constructor

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
   goToParticipateActivity(activityId: number): void {
    this.router.navigate(['/visiteur/activities/participate', activityId]);
  }
  goToCalendar(): void {
    this.router.navigate(['/admin/activities/calendar']);
  }
}


