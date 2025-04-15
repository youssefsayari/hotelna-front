import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service'; 
import { User } from '../../../models/user.model'; 

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No user data found in local storage.'
      });
    }
  }

  saveProfile() {
    if (this.user) {
      this.userService.updateUser(this.user).subscribe({
        next: (updatedUser) => {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile has been updated successfully!',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: `Failed to update profile: ${error.error.message || 'Unknown error'}`,
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No user information to update.',
        confirmButtonColor: '#d33'
      });
    }
  }
}
