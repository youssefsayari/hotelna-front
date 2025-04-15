import { Component } from '@angular/core';

@Component({
  selector: 'sidebar-items',
  templateUrl: './sidebar-items.component.html',
  standalone: false

})
export class SidebarItemsComponent {
  idUser: number = 0
  typeUser:string = 'VISITEUR'

}
