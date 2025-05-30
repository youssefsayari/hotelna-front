import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  public sidebarOpen: boolean;
  public currentRoute: string;

  constructor() {
    this.sidebarOpen = false;
    this.currentRoute = '/';
  }

  openSidebar() {
    this.sidebarOpen = true;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  setCurrentRoute(value: string) {
    this.currentRoute = value;
  }
  isUserLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getUserRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User role:', user.typeUser); 
    return user.typeUser || 'Visiteur';  
  }
}
