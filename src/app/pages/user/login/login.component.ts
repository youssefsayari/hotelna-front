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
  addUser(): void {
      Swal.fire({
        title: 'Add New User 📝',
        html:
          '<div style="text-align: left;">' +
            '<label style="font-weight: 600;">👤 Prenom:</label>' +
            '<br>' +
            '<input id="swal-input1" class="swal2-input" placeholder="Prenom">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">👤 Nom:</label>' +
            '<br>' +
            '<input id="swal-input2" class="swal2-input" placeholder="Nom">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">📧 Email:</label>' +
            '<br>' +
            '<input id="swal-input3" class="swal2-input" placeholder="email">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">📞 Telephone:</label>' +
            '<br>' +
            '<input id="swal-input4" class="swal2-input" placeholder="+123456789">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">🔒 Password:</label>' +
            '<br>' +
            '<input id="swal-input5" type="password" class="swal2-input" placeholder="••••••••">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">👥Type:</label>' +
            '<select id="swal-input6" class="swal2-input" disabled>' +
            '<option value="Visiteur">👥 Visiteur</option>' + 
          '</select>' +
          '</div>',
        focusConfirm: false,
        preConfirm: () => {
          const userData = {
            firstName: (document.getElementById('swal-input1') as HTMLInputElement).value,
            lastName: (document.getElementById('swal-input2') as HTMLInputElement).value,
            email: (document.getElementById('swal-input3') as HTMLInputElement).value,
            telephone: (document.getElementById('swal-input4') as HTMLInputElement).value,
            password: (document.getElementById('swal-input5') as HTMLInputElement).value,
            typeUser: 'Visiteur',  

          };
  
          return userData;
        },
        confirmButtonText: 'Add User',
        confirmButtonColor: '#28a745',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#dc3545',
        showCancelButton: true,
        customClass: {
          popup: 'custom-swal'
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.userService.addUser(result.value as User)
            .subscribe({
              next: (response) => {
                console.log("Response from addUser API:", response); // Log the response from API
                Swal.fire('Success!', 'User has been added. 🎉', 'success');
                
              },
              error: (error) => {
                console.error("Error from addUser API:", error); // Log the error from API
                Swal.fire('Error!', 'Failed to add user. 😞 ' + error.message, 'error');
              }
            });
        }
      });
    }


}
