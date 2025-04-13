import { Component } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'overlay',
  templateUrl: './overlay.component.html',
  standalone: false

})
export class OverlayComponent {
  constructor(private dashboard: DashboardService) {}

  sidebarOpen() {
    return this.dashboard.sidebarOpen;
  }

  closeSidebar() {
    this.dashboard.closeSidebar();
  }
}
