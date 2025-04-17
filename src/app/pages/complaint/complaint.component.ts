import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint.model';
import { User } from '../../models/user.model'; 
import { ComplaintStatus } from '../../models/complaint-status.enum';
import { ComplaintSolutionIA } from '../../models/complaint-solution-ia.model'; // Adjust the path if necessary
import { ComplaintCategories } from '../../models/complaint-categories.enum';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { catchError, tap, throwError } from 'rxjs';





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
    ]),
    trigger('cardHover', [
      state('normal', style({
        transform: 'scale(1)',
        boxShadow: 'none'
      })),
      state('hovered', style({
        transform: 'scale(1.02)',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
      })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ]),
    trigger('typingAnimation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    
    trigger('loadingBar', [
      state('loading', style({
        width: '100%',
        opacity: 1
      })),
      state('done', style({
        width: '100%',
        opacity: 0
      })),
      transition('* => loading', [
        style({ width: '0%', opacity: 1 }),
        animate('2s ease-in-out')
      ]),
      transition('loading => done', animate('300ms ease-out'))
    ])
  ]
})
export class ComplaintComponent implements OnInit, OnDestroy {
  /*------------------------------user Connecte---------------------*/
    user!: User; // Non-null assertion operator to indicate it will be assigned later
    userId!: number;
    typeUser!: string; 
    userFirstName!: string ;  
    userMap: { [userId: number]: User } = {};
   
  /*------------------------------user Connecte---------------------*/

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

selectedComplaint: Complaint | null | undefined;
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

// Variables d'état pour l'IA
aiState: 'idle' | 'loading' | 'done' | 'error' = 'idle';
aiResponse: any = null;
aiError: string = '';
hoverStates: { [key: number]: string } = {};
isNewSolution: boolean = false;


constructor( 
  private complaintService: ComplaintService,
  private fb: FormBuilder,private router: Router, private userService: UserService) 
  { this.initForm();}

   initForm(): void {
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
    if (this.typeUser !== 'Admin' && complaint.status !== ComplaintStatus.OUVERT) {
      this.showNotification('Modification impossible : la réclamation n\'est pas ouverte.', false);
      return;
    }
  
    this.selectedComplaint = complaint;
    this.editForm.patchValue({
      description: complaint.description,
      category: complaint.category,
      status: complaint.status,
      resolutionDetails: complaint.resolutionDetails || '',
      complaintDate: this.parseDate(complaint.complaintDate)
    });
  
    if (this.typeUser !== 'Admin') {
      this.editForm.get('status')?.disable();
    }
  
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
    const userId = this.userId; // À remplacer par l'ID de l'utilisateur connecté

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
    this.loadUserProfile();
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
    this.loadComplaints();
  }

  loadUserProfile() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.userId = this.user.idUser;
      this.typeUser = this.user.typeUser; // Assurez-vous que le type d'utilisateur est bien défini dans le modèle User
      this.userFirstName = this.user.firstName; // Assurez-vous que le prénom est bien défini dans le modèle User
      console.log('User ID:', this.userId);
      console.log('User Type:', this.user.firstName);
   
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You must login First !.'
      });
      this.router.navigate(['/login']);
    }
  }

  getUserInfo(userId: number): User | undefined {
    return this.userMap[userId];
  }
  

  loadComplaints(): void {
    this.loading = true;
    this.error = null;
  
    const observable = this.typeUser === 'Admin'
      ? this.complaintService.getAllComplaints()
      : this.complaintService.getComplaintsByUser(this.userId);
  
    observable.subscribe({
      next: (complaints) => {
        this.complaints = complaints;
        this.totalComplaintsCount = complaints.length;
        this.updateStatusStats();
  
        // Charger les utilisateurs liés à chaque plainte
        const uniqueUserIds = Array.from(new Set(complaints.map(c => c.userId)));
  
        uniqueUserIds.forEach(userId => {
          if (!this.userMap[userId]) {
            this.userService.getUserById(userId).subscribe({
              next: (user) => this.userMap[userId] = user,
              error: (err) => console.warn(`Erreur chargement user ${userId}`, err)
            });
          }
        });
  
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load complaints';
        this.loading = false;
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
confirmDelete(complaintId: number): void {
  Swal.fire({
    title: 'Confirmer la suppression',
    text: 'Êtes-vous sûr de vouloir supprimer cette réclamation?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Annuler',
    customClass: {
      popup: 'modern-swal',
      title: 'text-2xl font-bold',
      confirmButton: 'px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg',
      cancelButton: 'px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg mr-3'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteComplaint(complaintId);
    }
  });
}

private deleteComplaint(id: number): void {
  // Suppression optimiste
  const complaintToRemove = this.complaints.find(c => c.id === id);
  if (!complaintToRemove) return; // Si la réclamation n'existe pas dans la liste, rien à faire.

  // Enlever la réclamation de la liste optimiste
  this.complaints = this.complaints.filter(c => c.id !== id);
  this.updateStatusStats();
  this.totalComplaintsCount--;
  
  // Appel au service de suppression
  this.complaintService.deleteComplaint(id).subscribe({
    next: () => {
      // Succes de la suppression
      Swal.fire({
        title: 'Supprimé!',
        text: 'La réclamation a été supprimée avec succès.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'modern-swal-success'
        }
      });
    },
    error: (err) => {
      // Si erreur, restaurer l'élément et afficher un message d'erreur
      this.complaints.push(complaintToRemove);
      this.updateStatusStats();
      this.totalComplaintsCount++;

      Swal.fire({
        title: 'Erreur!',
        text: 'La suppression a échoué: ' + err.message,
        icon: 'error',
        customClass: {
          popup: 'modern-swal-error'
        }
      });
    }
  });
}

/*---------------------------------- PARTIE IA ---------------------------------------*/
// Méthode pour consulter l'IA
consultWithAI(complaint: Complaint) {
  this.selectedComplaint = complaint;
  this.aiState = 'loading';
  this.aiResponse = null;
  this.aiError = '';

  this.complaintService.getSolutionByComplaint(complaint.id!).subscribe({
    next: (existingSolution) => {
      if (existingSolution) {
        this.isNewSolution = false;
        this.mapExistingSolution(existingSolution);
      } else {
        this.isNewSolution = true;
        this.generateNewSolution(complaint);
      }
    },
    error: () => this.generateNewSolution(complaint)
  });
}

private mapExistingSolution(solution: ComplaintSolutionIA) {
  this.aiResponse = {
    message: solution.analyseReclamation,
    solution: solution.solutionProposee,
    apaisement: solution.compensation,
    delai: '24 heures' // Adaptez selon vos données
  };
  this.aiState = 'done';
}

private generateNewSolution(complaint: Complaint) {
  this.complaintService.generateAiSolution(
    complaint.category,
    complaint.description
  ).subscribe({
    next: (response) => {
      setTimeout(() => {
        this.aiResponse = response;
        this.aiState = 'done';
      }, 1500);
    },
    error: (err) => {
      this.aiError = err.message || "Erreur lors de l'analyse";
      this.aiState = 'error';
    }
  });
}

// Méthode pour accepter la solution IA
acceptSolution() {
  if (!this.selectedComplaint?.id || !this.aiResponse || !this.selectedComplaint.userId) {
    this.resetAI();
    return;
  }

  // Préparer l'objet solution IA selon le modèle backend
  const solutionIA: ComplaintSolutionIA = {
    id: 0, // L'ID sera généré côté serveur
    analyseReclamation: this.aiResponse.message,
    solutionProposee: this.aiResponse.solution,
    compensation: this.aiResponse.apaisement || '',
    complaintId: this.selectedComplaint.id
  };

  // Appeler le service spécifique pour accepter la solution IA
  this.complaintService.acceptSolutionAndAffectToComplaint(
    this.selectedComplaint.id,
    solutionIA
  ).subscribe({
    next: () => {
      // Créer un objet Complaint complet avec toutes les propriétés requises
      const updatedComplaint: Complaint = {
        ...this.selectedComplaint!,
        status: ComplaintStatus.EN_PROGRESSION,
        userId: this.selectedComplaint!.userId, // Garanti non-undefined grâce à la vérification initiale
        complaintDate: this.selectedComplaint!.complaintDate || new Date(),
        description: this.selectedComplaint!.description || '',
        category: this.selectedComplaint!.category || ComplaintCategories.AUTRE,
        resolutionDetails: this.selectedComplaint!.resolutionDetails || null,
        resolutionDate: this.selectedComplaint!.resolutionDate || null
      };

      // Mettre à jour la réclamation dans la liste
      const index = this.complaints.findIndex(c => c.id === updatedComplaint.id);
      if (index !== -1) {
        this.complaints[index] = updatedComplaint;
      }

      // Notification de succès
      Swal.fire({
        title: 'Solution acceptée',
        text: 'La solution IA a été appliquée avec succès',
        icon: 'success',
        timer: 10000,
        showConfirmButton: false,
        position: 'center',
        customClass: {
          popup: 'modern-swal',
          title: 'text-lg font-bold'
        }
      });

      this.resetAI();
    },
    error: (err) => {
      Swal.fire({
        title: 'Erreur',
        text: 'Échec de l\'application de la solution: ' + 
              (err.error?.message || err.message || 'Erreur inconnue'),
        icon: 'error',
        timer: 3000
      });
    }
  });
}


requestHumanHelp() {
  // Implémentez la logique de demande d'aide humaine
  Swal.fire({
    title: 'Demande envoyée',
    text: 'Un membre de notre équipe va prendre en charge votre réclamation',
    icon: 'info',
    timer: 10000
  });
  
  this.resetAI();
}

resetAI() {
  this.aiState = 'idle';
  this.selectedComplaint = null;
  this.aiResponse = null;
  this.aiError = '';
}
}