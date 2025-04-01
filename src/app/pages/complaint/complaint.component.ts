import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint.model';
import { ComplaintStatus } from '../../models/complaint-status.enum';
import { ComplaintCategories } from '../../models/complaint-categories.enum';
import Swal from 'sweetalert2';




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
complaintCategoriesList = Object.values(ComplaintCategories).filter(
  value => typeof value === 'string'
) as ComplaintCategories[];

selectedComplaint?: Complaint;
editForm!: FormGroup;
showEditPanel = false;

statusStats: {[key in ComplaintStatus]: number} = {
  [ComplaintStatus.OUVERT]: 0,
  [ComplaintStatus.EN_PROGRESSION]: 0,
  [ComplaintStatus.RESOLU]: 0,
  [ComplaintStatus.FERME]: 0
};

complaintStatusList = Object.values(ComplaintStatus);

 
constructor( 
  private complaintService: ComplaintService,
  private fb: FormBuilder) 
  { this.initForm();}

  private initForm(): void {
    this.editForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]],
      category: [null as ComplaintCategories | null, Validators.required],
      status: ['', Validators.required],
      resolutionDetails: ['']
    });
  }
  openEdit(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    this.editForm.patchValue({
      description: complaint.description,
      category: complaint.category, // Initialise la catégorie
      status: complaint.status,
      resolutionDetails: complaint.resolutionDetails || '',
      complaintDate: new Date(complaint.complaintDate)
    });
    this.showEditPanel = true;
  }

  submitUpdate(): void {
    if (this.editForm.valid && this.selectedComplaint) {
      const updatedComplaint = {
        ...this.selectedComplaint,
        ...this.editForm.value
      };
  
      this.complaintService.updateComplaint(updatedComplaint.id!, updatedComplaint)
        .subscribe({
          next: (res) => {
            const index = this.complaints.findIndex(c => c.id === res.id);
            this.complaints[index] = res;
            this.updateStats(); // Rafraîchit les stats après modification
            this.showEditPanel = false;
            this.showNotification('Réclamation mise à jour avec succès', true);
          },
          error: (err) => {
            this.showNotification('Erreur lors de la mise à jour', false);
            console.error('Update error:', err);
          }
        });
    }
  }

  private showNotification(message: string, isSuccess: boolean = true): void {
    Swal.fire({
      title: isSuccess ? 'Succès' : 'Erreur',
      text: message,
      icon: isSuccess ? 'success' : 'error',
      position: 'center',  // Changé de 'top-end' à 'center'
      showConfirmButton: true,  // Ajouté pour avoir un bouton de fermeture
      confirmButtonText: 'OK',
      timer: 3000,
      customClass: {
        popup: 'modern-swal',
        title: 'text-lg font-bold',
        confirmButton: 'swal-confirm-button'
      }
    });
  }

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
        this.updateStats(); // Ajoutez cette ligne
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
      case ComplaintStatus.OUVERT: return 'bg-blue-100';
      case ComplaintStatus.EN_PROGRESSION: return 'bg-yellow-100';
      case ComplaintStatus.RESOLU: return 'bg-green-100';
      case ComplaintStatus.FERME: return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  }
  getCategoryLabel(category: ComplaintCategories): string {
    switch (category) {
      case ComplaintCategories.SERVICE: return 'Service';
      case ComplaintCategories.NETTOYAGE: return 'Nettoyage';
      case ComplaintCategories.EQUIPEMENT: return 'Équipement';
      case ComplaintCategories.RESERVATION: return 'Réservation';
      case ComplaintCategories.AUTRE: return 'Autre';
      default: return category;
    }
  }
  getStatusLabel(status: ComplaintStatus): string {
    switch(status) {
      case ComplaintStatus.OUVERT: return 'Ouvert';
      case ComplaintStatus.EN_PROGRESSION: return 'En Progression';
      case ComplaintStatus.RESOLU: return 'Résolu';
      case ComplaintStatus.FERME: return 'Fermé';
      default: return status;
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
private updateStats(): void {
  // Réinitialiser les stats
  for (const status in this.statusStats) {
    this.statusStats[status as ComplaintStatus] = 0;
  }

  // Compter les réclamations par statut
  this.complaints.forEach(complaint => {
    if (complaint.status) {
      this.statusStats[complaint.status]++;
    }
  });
}
}