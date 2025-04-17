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
            '<label style="font-weight: 600;">👤 Prenom:</label><br>' +
            '<input id="swal-input1" class="swal2-input" placeholder="Prenom">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">👤 Nom:</label><br>' +
            '<input id="swal-input2" class="swal2-input" placeholder="Nom">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">📧 Email:</label><br>' +
            '<input id="swal-input3" class="swal2-input" placeholder="email@example.com">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">📞 Telephone:</label><br>' +
            '<input id="swal-input4" class="swal2-input" placeholder="+123456789">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">🔒 Password:</label><br>' +
            '<input id="swal-input5" type="password" class="swal2-input" placeholder="••••••••">' +
            '<br>' +
            '<label style="font-weight: 600; margin-top: 10px;">👥 Type:</label>' +
            '<select id="swal-input6" class="swal2-input">' +
              '<option value="Visiteur">👥 Visiteur</option>' +
            '</select>' +
          '</div>',
        focusConfirm: false,
        preConfirm: () => {
          const firstName = (document.getElementById('swal-input1') as HTMLInputElement).value.trim();
          const lastName = (document.getElementById('swal-input2') as HTMLInputElement).value.trim();
          const email = (document.getElementById('swal-input3') as HTMLInputElement).value.trim();
          const telephone = (document.getElementById('swal-input4') as HTMLInputElement).value.trim();
          const password = (document.getElementById('swal-input5') as HTMLInputElement).value.trim();
          const typeUser = (document.getElementById('swal-input6') as HTMLSelectElement).value;
    
          const nameRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^[+0-9\s\-]{6,20}$/;
  
          if (!firstName || !lastName || !email || !telephone || !password || !typeUser) {
            Swal.showValidationMessage('🚫 All fields are required.');
            return;
          }
    
          if (!firstName || !nameRegex.test(firstName)) {
            Swal.showValidationMessage('❌ Prenom ne doit contenir que des lettres.');
            return;
          }
          if (!lastName || !nameRegex.test(lastName)) {
            Swal.showValidationMessage('❌ Prenom ne doit contenir que des lettres.');
            return;
          }
          if (!email || !emailRegex.test(email)) {
            Swal.showValidationMessage('❌ Format Email invalide .');
            return;
          }
          if (!telephone || !phoneRegex.test(telephone)) {
            Swal.showValidationMessage('❌ Format Telephone invalide.');
            return;
          }
         
    
          return {
            firstName,
            lastName,
            email,
            telephone,
            password,
            typeUser
          };
        },
        confirmButtonText: 'Add User',
        confirmButtonColor: '#28a745',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#dc3545',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.userService.addUser(result.value as User)
            .subscribe({
              next: (response) => {
                Swal.fire('✅ Success!', 'User has been added. 🎉', 'success');
              },
              error: (error) => {
                Swal.fire('❌ Error!', 'Failed to add user. ' + error.message, 'error');
              }
            });
        }
      });
    }



    async forgotPassword() {
      const { value: email } = await Swal.fire({
        title: '📧 Forgot Password',
        input: 'email',
        inputPlaceholder: 'Enter your email address',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Envoyer Code',
        confirmButtonColor: '#28a745',
        width: '50%',
        showLoaderOnConfirm: true,
        preConfirm: async (email) => {
          if (!email) {
            Swal.showValidationMessage('⚠️ Please enter a valid email address');
            return false;
          }
  
          try {
            await this.userService.sendOtp(email).toPromise();
            return email;
          } catch (error) {
            Swal.showValidationMessage('❌ Failed to send OTP. Try again.');
            return false;
          }
        }
      });
  
      if (email) {
        await this.requestOtp(email);
      }
    }
  
    async requestOtp(email: string) {
      const { value: otp } = await Swal.fire({
        title: '🔑 Enter OTP',
        input: 'text',
        inputPlaceholder: 'Enter the OTP sent to your email',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Verifier code',
        confirmButtonColor: '#28a745',
        width: '50%',
        showLoaderOnConfirm: true,
        preConfirm: async (otp) => {
          if (!otp) {
            Swal.showValidationMessage('⚠️ Please enter the OTP');
            return false;
          }
  
          try {
            console.log(`Verifying OTP: ${otp} for email: ${email}`);
            const response = await this.userService.verifyOtp(email, +otp).toPromise();
  
            if (response === true) { 
              return otp;
            } else {
              Swal.showValidationMessage('❌ Invalid OTP. Try again.');
              return false;
            }
          } catch (error) {
            console.error('Error verifying OTP:', error);
            Swal.showValidationMessage('⚠️ Invalid OTP. Try again.');
            return false;
          }
        }
      });
  
      if (otp) {
        await this.changePassword(email);
      }
    }
  
    async changePassword(email: string) {
      const { value: newPassword } = await Swal.fire({
        title: '🔒 Change Password',
        input: 'password',
        inputPlaceholder: 'Enter your new password',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Change Password',
        confirmButtonColor: '#28a745',
        width: '50%',
        showLoaderOnConfirm: true,
        preConfirm: async (newPassword) => {
          if (!newPassword) {
            Swal.showValidationMessage('⚠️ Please enter a new password');
            return false;
          }
  
          try {
            await this.userService.changePassword(email, newPassword).toPromise();
            Swal.fire({
              title: '✅ Success',
              text: 'Your password has been changed!',
              icon: 'success',
              width: '50%',
              confirmButtonColor: '#28a745'
            });
            return true;
          } catch (error) {
            Swal.showValidationMessage('❌ Error changing password. Try again.');
            return false;
          }
        }
      });
    }
}
