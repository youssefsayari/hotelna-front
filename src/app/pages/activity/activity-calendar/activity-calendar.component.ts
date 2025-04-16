import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity';
import { TypeActivity } from 'src/app/models/typeActivity';
import { Location } from '@angular/common'; // <-- Add this import
@Component({
  selector: 'app-activity-calendar',
  templateUrl: './activity-calendar.component.html',
  styleUrls: ['./activity-calendar.component.css']
})
export class ActivityCalendarComponent implements OnInit {
  activities: Activity[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    views: {
      dayGridMonth: {
        dayMaxEventRows: 4,
        dayHeaderFormat: { weekday: 'short', day: 'numeric' }
      }
    },
    eventDisplay: 'block',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Use 24-hour format
    },
    events: [],
    eventContent: this.customEventContent.bind(this),
    eventClick: (info) => {
      const id = info.event.id;
      this.router.navigate(['/admin/activities/details', id]);
    }
  };

  constructor(
    private activityService: ActivityService,
    public router: Router,
    private location: Location // <-- Inject Location service

  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.initCalendarEvents();
      },
      error: () => {
        console.error('Error loading activities');
      }
    });
  }

  initCalendarEvents(): void {
    this.calendarOptions.events = this.activities.map(activity => ({
      id: activity.id?.toString(),
      title: activity.name, 
      start: `${activity.startDate}T${activity.startTime}`,
      color: this.getColorByType(activity.typeActivity),
      extendedProps: {
        time: activity.startTime.substring(0, 5), // Extract just HH:mm
        type: activity.typeActivity,
        price: activity.price
      }
    }));
  }

  customEventContent(arg: any) {
    const typeIcon = this.getIconByType(arg.event.extendedProps.type);
    
    return {
      html: `
        <div class="fc-event-content" style="padding: 2px;">
          <div class="flex items-center">
            <span class="mr-1">${typeIcon}</span>
            <span class="font-medium truncate">${arg.event.title}</span>
          </div>
          <div class="text-xs opacity-80 truncate">${arg.event.extendedProps.time}</div>
          <div class="text-xs font-semibold mt-1">$${arg.event.extendedProps.price}</div>
        </div>
      `
    };
  }

  getColorByType(type: TypeActivity): string {
    switch (type) {
      case TypeActivity.Recreational: return '#38b2ac'; // Teal
      case TypeActivity.Relaxation: return '#818cf8'; // Indigo
      case TypeActivity.Kids: return '#fbbf24'; // Amber
      case TypeActivity.Nightlife: return '#ec4899'; // Pink
      default: return '#94a3b8'; // Slate
    }
  }

  getIconByType(type: TypeActivity): string {
    switch (type) {
      case TypeActivity.Recreational: return '🏊‍♂️';
      case TypeActivity.Relaxation: return '🧖‍♀️';
      case TypeActivity.Kids: return '🧒';
      case TypeActivity.Nightlife: return '🎶';
      default: return '✅';
    }
  }
  goBack(): void {
    this.location.back();
  }
  
}