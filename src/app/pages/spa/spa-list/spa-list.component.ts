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
        Swal.fire('Erreur', 'Échec du chargement des spas.', 'error');
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
      title: '➕ Ajouter un nouveau Spa',
      html:
        '<div style="text-align: left;">' +
          '<label for="name">🌸 Nom :</label><br>' +
          '<input id="name" class="swal2-input" placeholder="Nom du spa">' +
          '<br><label for="description">📝 Description :</label><br>' +
          '<textarea id="description" class="swal2-textarea" placeholder="Description du spa" style="height: 100px;"></textarea>' +
          '<br><label for="price">💰 Prix (DT) :</label><br>' +
          '<input id="price" type="number" class="swal2-input" placeholder="100">' +
          '<br><label for="available">✅ Disponibilité :</label><br>' +
          '<select id="available" class="swal2-input" style="height: 40px;">' +
            '<option value="">-- Sélectionnez une option --</option>' +
            '<option value="true">✔️ Disponible</option>' +
            '<option value="false">❌ Indisponible</option>' +
          '</select>' +
        '</div>',
      confirmButtonText: '✅ Ajouter',
      cancelButtonText: '❌ Annuler',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        const description = (document.getElementById('description') as HTMLInputElement).value.trim();
        const priceStr = (document.getElementById('price') as HTMLInputElement).value.trim();
        const availableStr = (document.getElementById('available') as HTMLSelectElement).value;

        if (!name || !description || !priceStr || availableStr === '') {
          Swal.showValidationMessage('🚫 Tous les champs sont obligatoires.');
          return;
        }

        const price = parseFloat(priceStr);
        const available = availableStr === 'true';

        if (isNaN(price)) {
          Swal.showValidationMessage('❌ Le prix doit être un nombre.');
          return;
        }

        return { name, description, price, available };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.spaService.addSpa(result.value).subscribe({
          next: () => {
            Swal.fire('✅ Succès !', 'Spa ajouté avec succès.', 'success');
            this.loadSpas();
          },
          error: (error) => {
            Swal.fire('❌ Erreur !', 'Impossible d\'ajouter le spa. ' + error.message, 'error');
          }
        });
      }
    });
  }

  editSpa(spa: Spa): void {
    Swal.fire({
      title: '✏️ Modifier le Spa',
      html:
        '<div style="text-align: left;">' +
          `<label for="name">🌸 Nom :</label><br>` +
          `<input id="name" class="swal2-input" value="${spa.name}" placeholder="Nom du spa">` +
          `<br><label for="description">📝 Description :</label><br>` +
          `<textarea id="description" class="swal2-textarea" style="height: 100px;">${spa.description}</textarea>` +
          `<br><label for="price">💰 Prix (DT) :</label><br>` +
          `<input id="price" type="number" class="swal2-input" value="${spa.price}" placeholder="100">` +
          `<br><label for="available">✅ Disponibilité :</label><br>` +
          `<select id="available" class="swal2-input" style="height: 40px;">` +
            `<option value="">-- Sélectionnez une option --</option>` +
            `<option value="true" ${spa.available ? 'selected' : ''}>✔️ Disponible</option>` +
            `<option value="false" ${!spa.available ? 'selected' : ''}>❌ Indisponible</option>` +
          `</select>` +
        '</div>',
      confirmButtonText: '✅ Sauvegarder',
      cancelButtonText: '❌ Annuler',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        const description = (document.getElementById('description') as HTMLInputElement).value.trim();
        const priceStr = (document.getElementById('price') as HTMLInputElement).value.trim();
        const availableStr = (document.getElementById('available') as HTMLSelectElement).value;

        if (!name || !description || !priceStr || availableStr === '') {
          Swal.showValidationMessage('🚫 Tous les champs sont obligatoires.');
          return;
        }

        const price = parseFloat(priceStr);
        const available = availableStr === 'true';

        if (isNaN(price)) {
          Swal.showValidationMessage('❌ Le prix doit être un nombre.');
          return;
        }

        return { ...spa, name, description, price, available };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.spaService.updateSpa(spa.id!, result.value).subscribe({
          next: () => {
            Swal.fire('✅ Succès !', 'Spa mis à jour.', 'success');
            this.loadSpas();
          },
          error: (error) => {
            Swal.fire('❌ Erreur !', 'Échec de la mise à jour. ' + error.message, 'error');
          }
        });
      }
    });
  }

  deleteSpa(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action supprimera définitivement le spa.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '✅ Oui, supprimer',
      cancelButtonText: '❌ Annuler',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spaService.deleteSpa(id).subscribe({
          next: () => {
            Swal.fire('🗑 Supprimé', 'Le spa a été supprimé.', 'success');
            this.loadSpas();
          },
          error: (error) => {
            Swal.fire('❌ Erreur !', 'Impossible de supprimer le spa. ' + error.message, 'error');
          }
        });
      }
    });
  }
}
