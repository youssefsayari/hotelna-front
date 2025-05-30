import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChambreService } from '../../services/chambre.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { User } from '../../models/user.model';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-reservation-success',
  templateUrl: './reservation-success.component.html',
  styleUrls: ['./reservation-success.component.css'],
  providers: [DatePipe]
})
export class ReservationSuccessComponent implements OnInit {
      /*------------------------------user Connecte---------------------*/
        user!: User; // Non-null assertion operator to indicate it will be assigned later
        idUser!: number ;
        typeUser!: string ; // Peut aussi être 'ADMIN'
      /*------------------------------user Connecte---------------------*/
  // Propriétés existantes
  chambreNumero: string = '';
  chambreType: string = '';
  userEmail: string = '';
  
  // Nouvelles propriétés
  startDate: string = '';
  endDate: string = '';
  guests: number = 1;
  nights: number = 0;
  totalPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private chambreService: ChambreService,
    private datePipe: DatePipe,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.route.queryParams.subscribe(params => {
      this.chambreNumero = params['chambre_numero'] || '';
      this.chambreType = params['type'] || '';
      this.userEmail = params['email'] || '';
      
      // Nouvelles données
      this.startDate = params['startDate'] || '';
      this.endDate = params['endDate'] || '';
      this.guests = params['guests'] || 1;
      this.nights = this.calculateNights(this.startDate, this.endDate);
      this.totalPrice = this.calculateTotal(this.chambreType, this.startDate, this.endDate);

      if (params['chambre_id']) {
        this.reserverChambre(params['chambre_id']);
      }
    });
  }

    loadUserProfile() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
        this.idUser = this.user.idUser;
        this.typeUser = this.user.typeUser; // Assurez-vous que le type d'utilisateur est bien défini dans le modèle User
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You must login First !.'
        });
        this.router.navigate(['/login']);
      }
    } 

  private calculateNights(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  }

  private calculateTotal(roomType: string, startDate: string, endDate: string): number {
    const nights = this.calculateNights(startDate, endDate);
    switch(roomType) {
      case 'SIMPLE': return nights * 80;
      case 'DOUBLE': return nights * 120;
      case 'SUITE': return nights * 200;
      default: return 0;
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  reserverChambre(chambreId: number): void {
    const userId = this.idUser;
    this.chambreService.reserverChambre(chambreId, userId).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès!',
          text: 'Votre chambre a été réservée avec succès!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
        console.error('Erreur lors de la réservation:', err);
        Swal.fire({
          title: 'Erreur',
          text: 'La réservation a échoué',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}