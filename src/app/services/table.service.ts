import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { TableRes } from '../models/table-res';
import { TableReservationDTO } from '../models/table-reservation-dto';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private baseUrl = 'http://localhost:8088/restaurants/tables';
  constructor(private http: HttpClient) { }

  addTable(table: TableRes): Observable<TableRes> {
    return this.http.post<TableRes>(`${this.baseUrl}/add-table`, table);
  }

  getAllTables(): Observable<TableRes[]> {
    return this.http.get<TableRes[]>(`${this.baseUrl}/retrieve-all-tables`);
  }

  getTableById(id: number): Observable<TableRes> {
    return this.http.get<TableRes>(`${this.baseUrl}/retrieve-table/${id}`);
  }

  updateTable(table: TableRes): Observable<TableRes> {
    return this.http.put<TableRes>(`${this.baseUrl}/update-table`, table);
  }

  deleteTable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-table/${id}`);
  }

  reserveTable(tableId: number, userId: number): Observable<TableRes> {
    const reservationDTO: TableReservationDTO = { tableId, userId };
    return this.http.post<TableRes>(`${this.baseUrl}/reserve-table`, reservationDTO);
  }
  

  getTablesByRestaurantId(restaurantId: number): Observable<TableRes[]> {
    return this.http.get<TableRes[]>(`${this.baseUrl}/by-restaurant/${restaurantId}`);
  }
  
}
