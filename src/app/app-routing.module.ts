import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreditComponent } from './pages/credit/credit.component';
import { StatusComponent } from './pages/status/status.component';
import { ArchiveComponent } from './pages/archive/archive.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { LoginComponent } from './pages/user/login/login.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { AuthGuardService } from './services/auth-guard.service'; // Make sure the path is correct

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    data: { noLayout: true } 
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService], data: { roles: ['Admin', 'Visiteur'] }},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], data: { roles: ['Admin', 'Visiteur'] }},
  { path: 'admin/status', component: StatusComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] }},
  { path: 'admin/archives', component: ArchiveComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] }},
  { path: 'admin/credits', component: CreditComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] }},
  { path: 'admin/settings', component: SettingsComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] }},
  { path: 'userlist', component: UserListComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] }},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
