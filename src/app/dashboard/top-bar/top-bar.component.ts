import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import Router for redirection

import {DashboardService} from "../dashboard.service";

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  standalone: false

})
export class TopBarComponent {
  constructor(private dashboard: DashboardService,    private router: Router 
  ) {
    
  }

  openSidebar(){
    this.dashboard.openSidebar()
  }
  logout() {
    localStorage.clear();  
    sessionStorage.clear();

    this.router.navigate(['/login']);
  }
}
