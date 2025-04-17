import { Component, OnInit } from '@angular/core';
import { BlocService } from '../../services/bloc.service';
import { Bloc } from '../../models/bloc';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { EtatChambre } from 'src/app/models/chambre';

@Component({
  selector: 'app-bloc',
  templateUrl: './bloc.component.html',
  styleUrls: ['./bloc.component.css'],
})
export class BlocComponent implements OnInit {
  blocs: Bloc[] = [];
  filteredBlocs: Bloc[] = [];
  searchTerm: string = '';
  sortCriterion: 'name' | 'taux' | 'etage' = 'name'; 
  sortOrder: 'asc' | 'desc' = 'asc';
  isDropdownOpen: boolean = false; // Dropdown visibility state
  private destroy$ = new Subject<void>(); 


  constructor(private blocService: BlocService) {}

  ngOnInit(): void {
    this.loadBlocs();
  }
  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete(); 
  }

  
  loadBlocs(): void {
      this.blocService.getAllBlocs().subscribe({
        next: (data) => {
          this.blocs = data;
          this.filteredBlocs = [...this.blocs]; // Initialize filteredBlocs
          this.sortBlocs();
        },
        error: (err) => {
          console.error('Error fetching blocs:', err);
          Swal.fire('Error!', 'Failed to load blocs', 'error');
        }
      });
    }
  

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen; // Toggle dropdown visibility
  }

  calculateOccupancyRate(bloc: Bloc): number {
    const totalRooms = bloc.chambres?.length || 0;
    if (totalRooms === 0) return 0;
  
    const occupiedRooms = (bloc.chambres as any)?.filter(
      (chambre :any) => chambre.disponible === false
    ).length || 0;
  
    return Math.round((occupiedRooms / totalRooms) * 100);
  }

  getHeaderClass(bloc: Bloc): string {
    const occupancyRate = this.calculateOccupancyRate(bloc);

    if (occupancyRate === 100) {
      return 'px-4 py-3 bg-red-600'; 
    } else if (occupancyRate >= 75) {
      return 'px-4 py-3 bg-yellow-600'; 
    } else {
      return 'px-4 py-3 bg-blue-600'; 
    }
  }

  onAddBloc(): void {
    Swal.fire({
      title: 'Ajouter un Bloc', 
      html: `
        <input id="nomBloc" class="swal2-input" placeholder="Nom du Bloc">
        <input id="nombreEtages" type="number" class="swal2-input" placeholder="Nombre d'étages">
      `,
      focusConfirm: false, 
      showCancelButton: true, // Show a cancel button
      confirmButtonText: 'Ajouter', // Confirm button text
      cancelButtonText: 'Annuler', // Cancel button text
      preConfirm: () => {
        // Retrieve input values when the user confirms
        const nomBloc = (document.getElementById('nomBloc') as HTMLInputElement).value;
        const nombreEtages = (document.getElementById('nombreEtages') as HTMLInputElement).value;

        // Validate inputs
        if (!nomBloc || !nombreEtages) {
          Swal.showValidationMessage('Veuillez remplir tous les champs'); // Show validation message
        }

        // Return the data entered by the user
        return { nomBloc, nombreEtages: parseInt(nombreEtages, 10) };
      },
    }).then((result) => {
      // Handle the result after the user confirms
      if (result.isConfirmed) {
        const newBloc: Bloc = result.value;

        // Call the service to add the bloc
        this.blocService.createBloc(newBloc).subscribe(
          (response) => {
            console.log('Bloc créé:', response);
            Swal.fire('Succès!', 'Le bloc a été ajouté avec succès.', 'success');
            // Optionally refresh the list of blocs
            this.loadBlocs();
          },
          (error) => {
            console.error('Erreur lors de la création du bloc:', error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de la création du bloc.', 'error');
          }
        );
      }
    });
  }


  onEditBloc(bloc: Bloc): void {
   Swal.fire({
      title: 'Modifier le Bloc',
      html: `
        <input id="nomBloc" class="swal2-input" placeholder="Nom du Bloc" value="${bloc.nomBloc}">
        <input id="nombreEtages" type="number" class="swal2-input" placeholder="Nombre d'étages" value="${bloc.nombreEtages}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        // Retrieve input values when the user confirms
        const nomBloc = (document.getElementById('nomBloc') as HTMLInputElement).value;
        const nombreEtages = (document.getElementById('nombreEtages') as HTMLInputElement).value;

        // Validate inputs
        if (!nomBloc || !nombreEtages) {
          Swal.showValidationMessage('Veuillez remplir tous les champs');
        }

        // Return the updated data
        return {
          idBloc: bloc.idBloc,
          nomBloc,
          nombreEtages: parseInt(nombreEtages, 10),
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedBloc = result.value;
        console.log(updatedBloc);
        

        // Call the service to update the bloc
        this.blocService.updateBloc(updatedBloc.idBloc,updatedBloc).subscribe(
          (response) => {
            console.log('Bloc mis à jour:', response);
            Swal.fire('Succès!', 'Le bloc a été modifié avec succès.', 'success');
            // Optionally refresh the list of blocs
            this.loadBlocs();
          },
          (error) => {
            console.error('Erreur lors de la modification du bloc:', error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification du bloc.', 'error');
          }
        );
      }
    });
  }


    onDeleteBloc(idBloc: number): void {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Vous ne pourrez pas revenir en arrière!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          // Call the service to delete the bloc
          this.blocService.deleteBloc(idBloc).subscribe({
            next: (response) => {
              console.log(response); // "Bloc supprimé avec succès"
              this.loadBlocs(); // Refresh the list of blocs
            },
            error: (err) => {
              console.error('Error deleting bloc:', err);
            }
          });
        }
      })
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.filteredBlocs = this.blocs.filter((bloc) =>
      bloc.nomBloc.toLowerCase().includes(term.toLowerCase())
    );
  }

  toggleSortOrder(criterion: 'name' | 'taux' | 'etage'): void {
    if (this.sortCriterion === criterion) {
      // If the same criterion is clicked, toggle the order
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Otherwise, switch to the new criterion and reset the order
      this.sortCriterion = criterion;
      this.sortOrder = 'asc';
    }

    this.sortBlocs(); // Re-sort the list
  }
  
  sortBlocs(): void {
    this.filteredBlocs.sort((a, b) => {
      let comparison = 0;

      if (this.sortCriterion === 'name') {
        // Sort by name
        comparison = a.nomBloc.localeCompare(b.nomBloc);
      } else if (this.sortCriterion === 'taux') {
        // Sort by occupancy rate
        const tauxA = this.calculateOccupancyRate(a);
        const tauxB = this.calculateOccupancyRate(b);
        comparison = tauxA - tauxB;
      } else if (this.sortCriterion === 'etage') {
        // Sort by chamber count
        const countA = a.nombreEtages || 0;
        const countB = b.nombreEtages || 0;
        comparison = countA - countB;
      }

      // Reverse the order if sorting in descending order
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  getOccupancyRate(blocId: number): void {
    this.blocService.getOccupancyRate(blocId).subscribe((data) => {
      alert(
        `Taux d'occupation pour le bloc ${data.nomBloc}: ${data.tauxOccupation}`
      );
    });
  }
}