import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint.model';
import { ComplaintStatus } from '../../models/complaint-status.enum';
import { ComplaintCategories } from '../../models/complaint-categories.enum';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';





@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
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
updating = false;


statusStats: {[key in ComplaintStatus]: number} = {
  [ComplaintStatus.OUVERT]: 0,
  [ComplaintStatus.EN_PROGRESSION]: 0,
  [ComplaintStatus.RESOLU]: 0,
  [ComplaintStatus.FERME]: 0
};

complaintStatusList = Object.values(ComplaintStatus);

currentStatusFilter: ComplaintStatus | null = null;
totalComplaintsCount: number = 0;

showCreateModal = false;
creating = false;
createForm!: FormGroup;

constructor( 
  private complaintService: ComplaintService,
  private fb: FormBuilder) 
  { this.initForm();}

  private initForm(): void {
    // Formulaire de création
    this.createForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      category: ['', Validators.required]
    });
  
    // Formulaire d'édition
    this.editForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(1000)]],
      category: ['', Validators.required],
      status: ['', Validators.required],
      resolutionDetails: ['', [Validators.maxLength(2000)]]
    });
  }
  // Méthodes pour gérer le modal
  openCreateModal(): void {
    this.createForm.reset();
    this.showCreateModal = true;
  }
  openEdit(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    
    this.editForm.patchValue({
      description: complaint.description,
      category: complaint.category,
      status: complaint.status,
      resolutionDetails: complaint.resolutionDetails || '',
      complaintDate: this.parseDate(complaint.complaintDate)
    });
    
    this.onStatusChange();
    this.showEditPanel = true;
  }
  closeCreateModal(): void {
    this.showCreateModal = false;
    this.creating = false;
  }
  // Soumission du formulaire
submitCreate(): void {
  if (this.createForm.valid) {
    this.creating = true;
    const newComplaint: Partial<Complaint> = {
      description: this.createForm.value.description,
      category: this.createForm.value.category,
      status: ComplaintStatus.OUVERT // Statut par défaut
    };

    // Remplacez userId par l'ID réel de l'utilisateur connecté
    const userId = 2; // À remplacer par l'ID de l'utilisateur connecté

    this.complaintService.createComplaint(newComplaint as Complaint, userId)
      .subscribe({
        next: (createdComplaint) => {
          this.complaints.push(createdComplaint); 
          this.updateStatusStats();
          this.totalComplaintsCount++;
          this.closeCreateModal();
          this.showNotification('Réclamation créée avec succès', true);
        },
        error: (err) => {
          this.creating = false;
          this.showNotification('Erreur lors de la création', false);
          console.error('Create error:', err);
        }
      });
  }
}

submitUpdate(): void {
  if (this.editForm.valid && this.selectedComplaint) {
    this.updating = true;
    
    // Préparer l'objet de mise à jour
    const updatedComplaint = {
      ...this.selectedComplaint,
      ...this.editForm.value,
      
      // S'assurer que la date de résolution est mise à jour si le statut passe à RESOLU
      resolutionDate: this.editForm.value.status === ComplaintStatus.RESOLU 
        ? new Date().toISOString() 
        : this.selectedComplaint.resolutionDate
    };

    this.complaintService.updateComplaint(updatedComplaint.id!, updatedComplaint)
      .subscribe({
        next: (res) => {
          const index = this.complaints.findIndex(c => c.id === res.id);
          this.complaints[index] = res;
          this.updateStatusStats();
          this.updating = false;
          this.showEditPanel = false;
          this.showNotification('Réclamation mise à jour avec succès', true);
        },
        error: (err) => {
          this.updating = false;
          // Afficher les détails de l'erreur
          let errorMessage = 'Erreur lors de la mise à jour';

          if (err.error?.details) {
            // Erreurs de validation
            errorMessage += ': ' + err.error.details.join(', ');
          } else if (err.error?.message) {
            // Erreur métier
            errorMessage = err.error.message;
          }

          this.showNotification(errorMessage, false);

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
      next: (complaints) => {
        this.complaints = complaints;
        this.totalComplaintsCount = complaints.length; // Stocke le total
        this.updateStatusStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load complaints';
        this.loading = false;
        console.error(err);
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
  // Méthode pour gérer le changement de statut
    onStatusChange(): void {
      const status = this.editForm.get('status')?.value;
      const resolutionDetails = this.editForm.get('resolutionDetails');
      
      if (status === ComplaintStatus.RESOLU) {
        resolutionDetails?.setValidators([
          Validators.required, 
          Validators.maxLength(2000),
           Validators.minLength(10)
        ]);
      } else {
        resolutionDetails?.clearValidators();
      }
      resolutionDetails?.updateValueAndValidity();
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

updateStatusStats(): void {
  this.complaintStatusList.forEach(status => {
    this.statusStats[status] = this.complaints.filter(c => c.status === status).length;
  });
}
filterByStatus(status: ComplaintStatus): void {
  if (this.currentStatusFilter === status) {
    this.resetFilter();
    return;
  }

  this.currentStatusFilter = status;
  this.loading = true;
  this.error = null;

  this.complaintService.getComplaintsByStatus(status).subscribe({
    next: (complaints) => {
      this.complaints = complaints;
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Failed to load filtered complaints';
      this.loading = false;
      console.error(err);
    }
  });
}
resetFilter(): void {
  this.currentStatusFilter = null;
  this.loadComplaints(); // Recharge toutes les réclamations
}
private parseDate(dateInput: any): Date {
  if (dateInput instanceof Date) {
    return dateInput;
  }
  
  if (Array.isArray(dateInput)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
    return new Date(year, month - 1, day, hour, minute, second);
  }
  
  if (typeof dateInput === 'string') {
    return new Date(dateInput);
  }
  
  // Si le format est inconnu, retournez la date actuelle
  console.warn('Format de date non reconnu:', dateInput);
  return new Date();
}
formatDate(dateInput: any): string {
  const date = this.parseDate(dateInput);
  return date.toLocaleDateString('fr-FR'); // Format: dd/mm/yyyy
}
}