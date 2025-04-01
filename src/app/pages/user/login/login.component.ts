// login.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  user = { email: '', password: '' };

  constructor(private userService: UserService, private router: Router) {}
  ngOnInit() {
    document.body.classList.add('hide-dashboard-layout'); 
  }
  
  ngOnDestroy() {
    document.body.classList.remove('hide-dashboard-layout'); 
  }
  

  onLogin(): void {
    console.log("email ", this.user.email);
    console.log("password ", this.user.password);

    this.userService.login(this.user.email, this.user.password).subscribe({
      next: (user) => {
        console.log('Login successful', user);
        this.saveUser(user);
        Swal.fire({
          title: 'Success!',
          text: 'Login successful',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'  
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/home']);
          }
        });
      },
      error: (error) => {
        console.error('Login failed', error);
        Swal.fire({
          title: 'Error!',
          text: `Login failed: ${error.error.message || 'Unknown error'}`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'  
        });
      }
    });
  }

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
