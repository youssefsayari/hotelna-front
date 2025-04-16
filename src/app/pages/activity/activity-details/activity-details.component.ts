import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css']
})
export class ActivityDetailsComponent implements OnInit {
  activity!: Activity;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.activityService.getActivityById(id).subscribe({
      next: (data) => {
        this.activity = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'activité', err);
        this.error = 'Erreur lors du chargement des détails de l\'activité.';
        this.isLoading = false;
      }
    });
  }
  goBack(): void {
    window.history.back();
  }
  
}
