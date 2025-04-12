import { Component, OnInit } from '@angular/core';
import { SpaService } from '../../../services/spa.service';
import { Spa } from '../../../models/spa.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-spa-list',
  templateUrl: './spa-list.component.html',
  styleUrls: ['./spa-list.component.css']
})
export class SpaListComponent implements OnInit {
  spas: Spa[] = [];
  filteredSpas: Spa[] = [];
  searchName: string = '';

  constructor(private spaService: SpaService) {}

  ngOnInit(): void {
    this.loadSpas();
  }

  loadSpas(): void {
    this.spaService.getAllSpas().subscribe({
      next: (data) => {
        this.spas = data;
        this.filteredSpas = data;
      },
      error: () => {
        Swal.fire('Error!', 'Failed to load spas.', 'error');
      }
    });
  }

  filterSpas(): void {
    this.filteredSpas = this.spas.filter(spa =>
      spa.name.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }

  addSpa(): void {
    Swal.fire({
      title: 'Add New Spa 🌿',
      html:
        '<input id="name" class="swal2-input" placeholder="Name">' +
        '<input id="description" class="swal2-input" placeholder="Description">' +
        '<input id="price" type="number" class="swal2-input" placeholder="Price">' +
        '<select id="available" class="swal2-input">' +
        '<option value="true">Available</option>' +
        '<option value="false">Unavailable</option>' +
        '</select>',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        const description = (document.getElementById('description') as HTMLInputElement).value.trim();
        const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
        const available = (document.getElementById('available') as HTMLSelectElement).value === 'true';

        if (!name || isNaN(price)) {
          Swal.showValidationMessage('🚫 Name and Price are required.');
          return;
        }

        return { name, description, price, available };
      },
      showCancelButton: true,
      confirmButtonText: 'Add Spa',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.spaService.addSpa(result.value).subscribe({
          next: () => {
            Swal.fire('✅ Success!', 'Spa has been added.', 'success');
            this.loadSpas();
          },
          error: (error) => {
            Swal.fire('❌ Error!', 'Failed to add spa. ' + error.message, 'error');
          }
        });
      }
    });
  }

  editSpa(spa: Spa): void {
    Swal.fire({
      title: 'Edit Spa ✏️',
      html:
        `<input id="name" class="swal2-input" value="${spa.name}" placeholder="Name">` +
        `<input id="description" class="swal2-input" value="${spa.description}" placeholder="Description">` +
        `<input id="price" type="number" class="swal2-input" value="${spa.price}" placeholder="Price">` +
        `<select id="available" class="swal2-input">` +
        `<option value="true" ${spa.available ? 'selected' : ''}>Available</option>` +
        `<option value="false" ${!spa.available ? 'selected' : ''}>Unavailable</option>` +
        `</select>`,
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        const description = (document.getElementById('description') as HTMLInputElement).value.trim();
        const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
        const available = (document.getElementById('available') as HTMLSelectElement).value === 'true';

        if (!name || isNaN(price)) {
          Swal.showValidationMessage('🚫 Name and Price are required.');
          return;
        }

        return { ...spa, name, description, price, available };
      },
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.spaService.updateSpa(spa.id!, result.value).subscribe({
          next: () => {
            Swal.fire('✅ Updated!', 'Spa details have been updated.', 'success');
            this.loadSpas();
          },
          error: (error) => {
            Swal.fire('❌ Error!', 'Failed to update spa. ' + error.message, 'error');
          }
        });
      }
    });
  }

  deleteSpa(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the spa.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spaService.deleteSpa(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Spa has been deleted.', 'success');
            this.loadSpas();
          },
          error: (error) => {
            Swal.fire('❌ Error!', 'Failed to delete spa. ' + error.message, 'error');
          }
        });
      }
    });
  }
}
