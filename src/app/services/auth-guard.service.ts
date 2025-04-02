import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const requiredRoles = route.data['roles'] as Array<string>;

      if (user && requiredRoles.includes(user.typeUser)) {
        return true;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You do not have permission to view this page.',
          confirmButtonColor: '#d33',
        }).then((result) => {
          this.router.navigate(['/login']);
        });
        return false;
      }
  }
}
