import { Component, Input } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'sidebar-item',
  templateUrl: './sidebar-item.component.html',
  standalone: false
})
export class SidebarItemComponent {
  @Input() title: string;
  @Input() routerLink: string;
  @Input() roles: string[] = [];  // Accept roles as input

  constructor(private dashboard: DashboardService) {
    this.title = '';
    this.routerLink = '';
  }

  currentRoute() {
    return this.dashboard.currentRoute;
  }

  sidebarOpen() {
    return this.dashboard.sidebarOpen;
  }

  hasAccess(): boolean {
    const userRole = this.dashboard.getUserRole();
    return this.roles.length === 0 || this.roles.includes(userRole);
  }
}
