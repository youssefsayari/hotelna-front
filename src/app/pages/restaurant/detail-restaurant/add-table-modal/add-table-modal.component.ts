import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableRes } from '../../../../models/table-res';
import { TableService } from '../../../../services/table.service';

@Component({
  selector: 'app-add-table-modal',
  templateUrl: './add-table-modal.component.html',
  styleUrls: ['./add-table-modal.component.css']
})
export class AddTableModalComponent {
  @Input() restaurantId!: number;
  @Output() tableAdded = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  newTable: TableRes = new TableRes();
  loading = false;

  constructor(private tableService: TableService) {}

  onSubmit(): void {
    this.loading = true;
    this.newTable.restaurant = { id: this.restaurantId };
    
    this.tableService.addTable(this.newTable).subscribe(
      () => {
        this.tableAdded.emit();
        this.closeModal.emit();
        this.newTable = new TableRes();
      },
      (error) => {
        console.error('Error adding table:', error);
        this.loading = false;
      }
    );
  }

  onClose(): void {
    this.closeModal.emit();
  }
} 