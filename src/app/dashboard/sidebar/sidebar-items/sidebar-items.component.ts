import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model'; 
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'sidebar-items',
  templateUrl: './sidebar-items.component.html',
  standalone: false
})
export class SidebarItemsComponent implements OnInit {


    /*------------------------------user Connecte---------------------*/
      user!: User; // Non-null assertion operator to indicate it will be assigned later
      idUser!: number ;
      typeUser!: string ; // Peut aussi être 'ADMIN'
    /*------------------------------user Connecte---------------------*/
  constructor(private userService: UserService, private router: Router){}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.idUser = this.user.idUser;
      this.typeUser = this.user.typeUser; // Assurez-vous que le type d'utilisateur est bien défini dans le modèle User
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You must login First !.'
      });
      this.router.navigate(['/login']);
    }
  } 
}
