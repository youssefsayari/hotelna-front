import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';  // Import SweetAlert2

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: false

})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];  
  searchName: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data; 
      },
      error: (err) => {
        console.error('Failed to get users', err);
        Swal.fire('Error!', 'Failed to load users.', 'error');
      }
    });
  }
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(this.searchName.toLowerCase()) ||
      user.lastName.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }
  

  editUser(user: User): void {
    Swal.fire({
      title: 'Edit User',
      html:
        '<div style="text-align: left;">' +
        `<label style="font-weight: 600;">👤 Prenom:</label>` +
        '<br>' +
        `<input id="swal-input1" class="swal2-input" value="${user.firstName}">` +
        '<br>' +
        `<label style="font-weight: 600; margin-top: 10px;">👤 Nom:</label>` +
        '<br>' +
        `<input id="swal-input2" class="swal2-input" value="${user.lastName}">` +
        '<br>' +
        `<label style="font-weight: 600; margin-top: 10px;">📧 Email:</label>` +
        '<br>' +
        `<input id="swal-input3" class="swal2-input" value="${user.email}">` +
        '<br>' +
        `<label style="font-weight: 600; margin-top: 10px;">📞 Telephone:</label>` +
        '<br>' +
        `<input id="swal-input4" class="swal2-input" value="${user.telephone}">` +
        '<br>' +
        `<label style="font-weight: 600; margin-top: 10px;">🔒 Password:</label>` +
        '<br>' +
        `<input id="swal-input5" type="password" class="swal2-input" placeholder="Enter new or leave old">` +
        '<br>' +
        `<label style="font-weight: 600; margin-top: 10px;">👥 Type:</label>` +
        `<select id="swal-input6" class="swal2-input">` +
          `<option value="Admin" ${user.typeUser === 'Admin' ? 'selected' : ''}>👤 Admin</option>` +
          `<option value="Visiteur" ${user.typeUser === 'Visiteur' ? 'selected' : ''}>👥 Visitor</option>` +
        `</select>` +
        '</div>',
      focusConfirm: false,
      preConfirm: () => {
        const newPassword = (document.getElementById('swal-input5') as HTMLInputElement).value;

        

        return {
          idUser: user.idUser,
          firstName: (document.getElementById('swal-input1') as HTMLInputElement).value,
          lastName: (document.getElementById('swal-input2') as HTMLInputElement).value,
          email: (document.getElementById('swal-input3') as HTMLInputElement).value,
          telephone: (document.getElementById('swal-input4') as HTMLInputElement).value,
          password: newPassword ? newPassword : user.password, // Keep old password if empty
          typeUser: (document.getElementById('swal-input6') as HTMLSelectElement).value,
        };
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        console.log("Data sent to update:", result.value); // Log the data being sent to update
        this.userService.updateUser(result.value as User)
          .subscribe({
            next: (response) => {
              console.log("Response from updateUser API:", response); // Log the response from API
              Swal.fire('Updated!', 'User details have been updated.', 'success');
              this.loadUsers();  // Refresh the list after successful update
            },
            error: (error) => {
              console.error("Error from updateUser API:", error); // Log the error from API
              Swal.fire('Error!', 'Failed to update user. 😞 ' + error.message, 'error');
            }
          });
      }
    });
  }
  

  deleteUser(idUser: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUserById(idUser).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Failed to delete user', err);
            Swal.fire('Error!', 'Failed to delete user.', 'error');
          }
        });
      }
    });
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
            '<option value="Admin">👤 Admin</option>' +
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
              this.loadUsers();
            },
            error: (error) => {
              Swal.fire('❌ Error!', 'Failed to add user. ' + error.message, 'error');
            }
          });
      }
    });
  }
  

}
  
  

