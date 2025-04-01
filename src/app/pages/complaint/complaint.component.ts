import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint.model';
import { ComplaintStatus } from '../../models/complaint-status.enum';
import { ComplaintCategories } from '../../models/complaint-categories.enum';


@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})
export class ComplaintComponent implements OnInit, OnDestroy {
  currentTime: string = '';
  private timer: any;

  viewMode: 'grid' | 'list' = 'grid'; // Initialisé dans la classe

  complaints: Complaint[] = [];
  loading = true;
  error: string | null = null;

ComplaintStatus = ComplaintStatus;
ComplaintCategories = ComplaintCategories;
 
constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;
    this.error = null;
    
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 403) {
          this.error = 'Access forbidden - check your authentication';
        } else {
          this.error = 'Failed to load complaints. Please try again later.';
        }
        console.error('Error details:', err);
      }
    });
  }
  getStatusClass(status: ComplaintStatus | undefined): string {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case ComplaintStatus.OUVERT:
        return 'bg-blue-100 text-blue-800';
      case ComplaintStatus.EN_PROGRESSION:
        return 'bg-yellow-100 text-yellow-800';
      case ComplaintStatus.RESOLU:
        return 'bg-green-100 text-green-800';
      case ComplaintStatus.FERME:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  getProgressWidth(status: ComplaintStatus | undefined): number {
    if (!status) return 0;
    
    switch (status) {
      case ComplaintStatus.OUVERT: return 25;
      case ComplaintStatus.EN_PROGRESSION: return 60;
      case ComplaintStatus.RESOLU: return 100;
      case ComplaintStatus.FERME: return 100;
      default: return 0;
    }
  }
  getCardColor(status: ComplaintStatus | undefined): string {
    if (!status) return 'bg-gray-200';
    
    switch (status) {
      case ComplaintStatus.OUVERT: return 'bg-blue-200';
      case ComplaintStatus.EN_PROGRESSION: return 'bg-yellow-200';
      case ComplaintStatus.RESOLU: return 'bg-green-200';
      case ComplaintStatus.FERME: return 'bg-red-200';
      default: return 'bg-gray-200';
    }
  }
getCategoryLabel(category: ComplaintCategories): string {
  switch (category) {
    case ComplaintCategories.SERVICE: return 'Service';
    case ComplaintCategories.NETTOYAGE: return 'Nettoyage';
    case ComplaintCategories.EQUIPEMENT: return 'Équipement';
    case ComplaintCategories.RESERVATION: return 'Réservation';
    case ComplaintCategories.AUTRE: return 'Autre';
    default: return category as unknown as string;
  }
}

  toggleView(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }



  private updateTime(): void {
    const now = new Date();
    this.currentTime = this.formatTunisianTime(now);
  }

  private formatTunisianTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour12: false 
    };
    return date.toLocaleString('fr-FR', options)
               .replace(',', ' -'); 
  }
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}