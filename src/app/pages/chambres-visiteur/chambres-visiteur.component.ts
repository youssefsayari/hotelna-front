import { Component, OnInit } from '@angular/core';
import { ChambreService } from '../../services/chambre.service';
import { Chambre, TypeChambre, EtatChambre } from '../../models/chambre';
import Swal from 'sweetalert2';
import { loadStripe,Stripe } from '@stripe/stripe-js';

// Remplacez par votre clé publique Stripe
const STRIPE_PK = 'pk_test_51RDUWuRsiUi8eknO8lpme5OnNT278W4kPBwzAz3r1Xu4yoZsIcecezqm6oCwlDrq3Cp83t9ep0tyFpq0QvVQ4k4K00UVmvqZcO';

@Component({
  selector: 'app-chambres-visiteur',
  templateUrl: './chambres-visiteur.component.html',
  styleUrls: ['./chambres-visiteur.component.css']
})
export class ChambresVisiteurComponent implements OnInit {
  chambres: Chambre[] = [];
  stripePromise: Promise<Stripe | null>;
  readonly DEFAULT_USER_ID = 3; // ID utilisateur par défaut


  constructor(private chambreService: ChambreService) {
    this.stripePromise = loadStripe(STRIPE_PK);

   }

  ngOnInit(): void {
    this.getChambresDisponibles();
  }

  getChambresDisponibles(): void {
    this.chambreService.getAllChambres().subscribe({
      next: (data) => {
        this.chambres = data.filter(c =>
          c.chambreEtat === 'NON_RESERVEE'
        );
      },
      error: (err) => {
        console.error('Error fetching chambres:', err);
        Swal.fire('Erreur !', 'Échec du chargement des chambres', 'error');
      }
    });
  }

  getHeaderClass(type: TypeChambre): string {
    switch(type) {
      case 'SIMPLE': return 'header-simple';
      case 'DOUBLE': return 'header-double';
      case 'SUITE': return 'header-suite';
      default: return 'header-simple';
    }
  }
  
  getStatusColor(etat: EtatChambre): string {
    switch(etat) {
      case 'DISPONIBLE': return 'status-available';
      case 'OCCUPEE': return 'status-occupied';
      case 'EN_NETTOYAGE': return 'status-cleaning';
      default: return '';
    }
  }

  getPrixChambre(type: TypeChambre): number {
    switch(type) {
      case 'SIMPLE': return 80;
      case 'DOUBLE': return 120;
      case 'SUITE': return 200;
      default: return 0;
    }
  }

  private getStripePriceId(type: TypeChambre): string {
    const prices = {
      'SIMPLE': 'price_1RDUahRsiUi8eknOl9g5jpDi', // ID pour chambre simple
      'DOUBLE': 'price_1RDUb6RsiUi8eknOC7jIkjIf', // ID pour chambre double
      'SUITE': 'price_1RDUbJRsiUi8eknO7YoFlWy1'   // ID pour suite
    };
    return prices[type] || prices['SIMPLE'];
  }

  async onReserverChambre(chambre: Chambre): Promise<void> {
    // 1. Demander les informations client avec les nouveaux champs
    const { value: formValues } = await Swal.fire({
      title: `<span style="font-size: 1.5rem; color: #2c3e50;">Réserver Chambre #${chambre.numero}</span>`,
      html: `
        <div style="text-align: left; padding: 0 1rem;">
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #2c3e50;">Nom complet</label>
            <input id="swal-name" 
                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"
                   placeholder="Jean Dupont">
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #2c3e50;">Email</label>
            <input id="swal-email" 
                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"
                   placeholder="email@exemple.com" 
                   type="email">
          </div>

          <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #2c3e50;">Date d'arrivée</label>
              <input id="swal-start-date" 
                     type="date"
                     style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"
                     min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #2c3e50;">Date de départ</label>
              <input id="swal-end-date" 
                     type="date"
                     style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"
                     min="${new Date().toISOString().split('T')[0]}">
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #2c3e50;">Nombre de personnes</label>
            <select id="swal-guests" 
                    style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
              ${Array.from({length: chambre.typeChambre === 'SIMPLE' ? 2 : 4}, (_, i) => 
                `<option value="${i+1}">${i+1} personne${i > 0 ? 's' : ''}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<span style="font-weight: 600;">Payer maintenant</span>',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      focusConfirm: false,
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm-btn',
        cancelButton: 'custom-swal-cancel-btn'
      },
      preConfirm: () => {
        const startDate = (document.getElementById('swal-start-date') as HTMLInputElement).value;
        const endDate = (document.getElementById('swal-end-date') as HTMLInputElement).value;
        
        // Validation des dates
        if (!startDate || !endDate) {
          Swal.showValidationMessage('Veuillez sélectionner les dates de réservation');
          return false;
        }
        if (new Date(startDate) >= new Date(endDate)) {
          Swal.showValidationMessage('La date de départ doit être après la date d\'arrivée');
          return false;
        }

        return {
          name: (document.getElementById('swal-name') as HTMLInputElement).value,
          email: (document.getElementById('swal-email') as HTMLInputElement).value,
          startDate: startDate,
          endDate: endDate,
          guests: (document.getElementById('swal-guests') as HTMLSelectElement).value
        };
      }
    });

    if (!formValues) return;

    // 2. Configuration de la session Stripe avec les nouvelles données
    const stripe = await this.stripePromise;
    
    if (!stripe) {
      Swal.fire('Erreur', 'Impossible de charger le système de paiement', 'error');
      return;
    }

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{
          price: this.getStripePriceId(chambre.typeChambre),
          quantity: this.calculateNights(formValues.startDate, formValues.endDate), // Calcul du nombre de nuits
        }],
        mode: 'payment',
        successUrl: `${window.location.origin}/reservation-success?chambre_id=${chambre.idChambre}&chambre_numero=${chambre.numero}&type=${chambre.typeChambre}&email=${encodeURIComponent(formValues.email)}&startDate=${formValues.startDate}&endDate=${formValues.endDate}&guests=${formValues.guests}`,
        cancelUrl: `${window.location.origin}/chambres`,
        customerEmail: formValues.email,
        billingAddressCollection: 'required'
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Stripe error:', error);
      Swal.fire('Erreur', 'Une erreur est survenue lors du paiement', 'error');
    }
}

// Ajoutez cette méthode à votre composant pour calculer le nombre de nuits
private calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
}