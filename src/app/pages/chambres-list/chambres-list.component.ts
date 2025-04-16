import { Component, OnInit } from '@angular/core';
import { ChambreService } from '../../services/chambre.service';
import { Chambre, TypeChambre, EtatChambre, ChambreReservation } from '../../models/chambre';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chambres-list',
  templateUrl: './chambres-list.component.html',
  styleUrls: ['./chambres-list.component.css']
})
export class ChambresListComponent implements OnInit {
  chambres: Chambre[] = [];
  typeChambres = Object.values(TypeChambre);
  etatChambres = Object.values(EtatChambre);
  reservationStates = Object.values(ChambreReservation);
  searchTerm: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  filteredChambres: Chambre[] = [];

  constructor(private chambreService: ChambreService) { }

  ngOnInit(): void {
    this.getChambres();
  }

  getChambres(): void {
    this.chambreService.getAllChambres().subscribe({
      next: (data) => {
        this.chambres = data;
        this.filteredChambres = [...this.chambres];
        this.sortByNumber();
      },
      error: (err) => {
        console.error('Error fetching chambres:', err);
        Swal.fire('Error!', 'Failed to load chambres', 'error');
      }
    });
  }

  onSearchChange(searchValue: string): void {
    this.searchTerm = searchValue;
    this.filterChambres();
  }

  filterChambres(): void {
    if (!this.searchTerm) {
      this.filteredChambres = [...this.chambres];
    } else {
      this.filteredChambres = this.chambres.filter(chambre => 
        chambre.numero.toString().includes(this.searchTerm)
      );
    }
    this.sortByNumber();
  }

  sortByNumber(): void {
    this.filteredChambres.sort((a, b) => {
      return this.sortOrder === 'asc' 
        ? a.numero - b.numero 
        : b.numero - a.numero;
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortByNumber();
  }

  getHeaderClass(type: string): string {
    switch(type) {
      case 'SIMPLE': return 'header-simple';
      case 'DOUBLE': return 'header-double';
      case 'SUITE': return 'header-suite';
      default: return 'header-simple';
    }
  }
  
  getStatusColor(etat: string): string {
    switch(etat) {
      case 'DISPONIBLE': return 'status-available';
      case 'OCCUPEE': return 'status-occupied';
      case 'EN_NETTOYAGE': return 'status-cleaning';
      default: return '';
    }
  }

  onEditChambre(chambre: Chambre): void {
    Swal.fire({
      title: `Modifier Chambre #${chambre.numero}`,
      html:
        `<div style="text-align: left; margin: 0 10px;">
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Numéro:</label>
            <input id="swal-numero" class="swal2-input" value="${chambre.numero}" type="number" min="1" style="width: 100%;">
          </div>
          
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Étage:</label>
            <input id="swal-etage" class="swal2-input" value="${chambre.etage}" type="number" min="0" style="width: 100%;">
          </div>
          
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Type:</label>
            <select id="swal-type" class="swal2-input" style="width: 100%;">
              ${this.typeChambres.map(type => 
                `<option value="${type}" ${type === chambre.typeChambre ? 'selected' : ''}>
                  ${type}
                </option>`
              ).join('')}
            </select>
          </div>
          
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">État:</label>
            <select id="swal-etat" class="swal2-input" style="width: 100%;">
              ${this.etatChambres.map(etat => 
                `<option value="${etat}" ${etat === chambre.etat ? 'selected' : ''}>
                  ${etat}
                </option>`
              ).join('')}
            </select>
          </div>
        </div>`,
      focusConfirm: false,
      preConfirm: () => {
        const etat = (document.getElementById('swal-etat') as HTMLSelectElement).value as EtatChambre;
        let chambreEtat: ChambreReservation = ChambreReservation.NON_RESERVEE;
if (etat === 'OCCUPEE') {
  chambreEtat = ChambreReservation.RESERVEE;
}
        return {
          idChambre: chambre.idChambre,
          numero: Number((document.getElementById('swal-numero') as HTMLInputElement).value),
          etage: Number((document.getElementById('swal-etage') as HTMLInputElement).value),
          typeChambre: (document.getElementById('swal-type') as HTMLSelectElement).value as TypeChambre,
          etat: etat,
          chambreEtat: chambreEtat,
          user: chambre.user
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      width: '600px'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.chambreService.updateChambre(result.value).subscribe({
          next: () => {
            Swal.fire('Succès!', 'La chambre a été modifiée', 'success');
            this.getChambres();
          },
          error: (err) => {
            Swal.fire('Erreur!', 'Échec de la modification', 'error');
            console.error(err);
          }
        });
      }
    });
  }
  onAddChambre(): void {
    Swal.fire({
      title: 'Ajouter une nouvelle chambre',
      html:
        `<div style="text-align: left; margin: 0 10px;">
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Numéro:</label>
            <input id="swal-numero" class="swal2-input" placeholder="Numéro de chambre" type="number" min="1" style="width: 100%;">
          </div>
          
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Étage:</label>
            <input id="swal-etage" class="swal2-input" placeholder="Numéro d'étage" type="number" min="0" style="width: 100%;">
          </div>
          
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">Type:</label>
            <select id="swal-type" class="swal2-input" style="width: 100%;">
              ${this.typeChambres.map(type => 
                `<option value="${type}">${type}</option>`
              ).join('')}
            </select>
          </div>
          
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 5px;">État:</label>
            <select id="swal-etat" class="swal2-input" style="width: 100%;">
              ${this.etatChambres.map(etat => 
                `<option value="${etat}">${etat}</option>`
              ).join('')}
            </select>
          </div>
        </div>`,
      focusConfirm: false,
      preConfirm: () => {
        const etat = (document.getElementById('swal-etat') as HTMLSelectElement).value as EtatChambre;
        let chambreEtat: ChambreReservation = ChambreReservation.NON_RESERVEE;
if (etat === 'OCCUPEE') {
  chambreEtat = ChambreReservation.RESERVEE;
}

        return {
          numero: Number((document.getElementById('swal-numero') as HTMLInputElement).value),
          etage: Number((document.getElementById('swal-etage') as HTMLInputElement).value),
          typeChambre: (document.getElementById('swal-type') as HTMLSelectElement).value as TypeChambre,
          etat: etat,
          chambreEtat: chambreEtat,
          user: null
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      width: '600px'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.chambreService.createChambre(result.value).subscribe({
          next: () => {
            Swal.fire('Succès!', 'La chambre a été ajoutée', 'success');
            this.getChambres();
          },
          error: (err) => {
            Swal.fire('Erreur!', "Échec de l'ajout de la chambre", 'error');
            console.error(err);
          }
        });
      }
    });
  }
  
  
  onDeleteChambre(id: number): void {
    Swal.fire({
      title: 'Confirmation',
      html: `
        <div class="text-lg">
          <p>Voulez-vous vraiment supprimer cette chambre?</p>
          <p class="text-red-500 mt-2">Cette action est irréversible !</p>
        </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.chambreService.deleteChambre(id).subscribe({
          next: () => {
            Swal.fire('Supprimé!', 'La chambre a été supprimée', 'success');
            this.getChambres();
          },
          error: (err) => {
            Swal.fire('Erreur!', 'Échec de la suppression', 'error');
            console.error(err);
          }
        });
      }
    });
  }
}