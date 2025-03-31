import { Component } from '@angular/core';
import {DashboardService} from "../dashboard.service";

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  standalone: false

})
export class TopBarComponent {
  constructor(private dashboard: DashboardService) {
  }

  openSidebar(){
    this.dashboard.openSidebar()
  }
}
