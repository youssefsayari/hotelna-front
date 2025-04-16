import { Component } from '@angular/core';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { Route, Router } from '@angular/router';
import { Bloc } from 'src/app/models/bloc';
import { BlocService } from 'src/app/services/bloc.service';
import { fallInAnimation } from './fallin'; 

@Component({
  selector: 'app-client-bloc',
  templateUrl: './client-bloc.component.html',
  styleUrls: ['./client-bloc.component.css'],
  animations:[fallInAnimation]
})
export class ClientBlocComponent {

  blocs: Bloc[] = [];
  filteredBlocs: Bloc[] = [];
  searchTerm: string = '';
  sortCriterion: string = ''; // Current sorting criterion
  sortOrder: 'asc' | 'desc' = 'asc'; // Current sorting order
  isDropdownOpen: boolean = false; // Controls dropdown visibility
  showCards = false;

  constructor(private blocService: BlocService,private router :Router) {}

  ngOnInit(): void {

    this.loadBlocs();
    setTimeout(() => {
      this.showCards = true; // Trigger the animation after a short delay
    }, 100);
  }

  loadBlocs(): void {
    this.blocService.getAllBlocs().subscribe((data) => {
      
      this.blocs = data;
      this.filteredBlocs = [...this.blocs]; 
    });
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
  navigateToChambres(blocId: number): void {
    this.router.navigate(['/visiteur/chambres']);
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.filteredBlocs = this.blocs.filter((bloc) =>
      bloc.nomBloc.toLowerCase().includes(term.toLowerCase())
    );
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSortOrder(criterion: string): void {
    if (this.sortCriterion === criterion) {
      // Toggle between ascending and descending order
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new criterion and reset to ascending order
      this.sortCriterion = criterion;
      this.sortOrder = 'asc';
    }
    this.applySorting();
  }

  applySorting(): void {
    if (!this.sortCriterion) return;

    this.filteredBlocs.sort((a, b) => {
      let valueA, valueB;

      switch (this.sortCriterion) {
        case 'name':
          valueA = a.nomBloc.toLowerCase();
          valueB = b.nomBloc.toLowerCase();
          break;
        case 'taux':
          valueA = this.calculateOccupancyRate(a);
          valueB = this.calculateOccupancyRate(b);
          break;
        case 'chamberCount':
          valueA = a.chambres?.length || 0;
          valueB = b.chambres?.length || 0;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

}

