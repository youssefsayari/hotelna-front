import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreditComponent } from './pages/credit/credit.component';
import { StatusComponent } from './pages/status/status.component';
import { ArchiveComponent } from './pages/archive/archive.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ComplaintComponent } from './pages/complaint/complaint.component';


import {RestaurantComponent} from "./pages/restaurant/restaurant.component";
import {AddRestaurantComponent} from "./pages/restaurant/add-restaurant/add-restaurant.component";
import {DetailRestaurantComponent} from "./pages/restaurant/detail-restaurant/detail-restaurant.component";
import {UpdateRestaurantComponent} from "./pages/restaurant/update-restaurant/update-restaurant.component";
import {ChambresListComponent} from "./pages/chambres-list/chambres-list.component";
import { ChambresVisiteurComponent } from './pages/chambres-visiteur/chambres-visiteur.component';
import { ReservationSuccessComponent } from './pages/reservation-success/reservation-success.component';
import { RateRestaurantComponent } from './pages/restaurant/rate-restaurant/rate-restaurant.component';
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { LoginComponent } from './pages/user/login/login.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SpaListComponent } from './pages/spa/spa-list/spa-list.component';


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
  { path: 'spalist', component: SpaListComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] }},
  { path: 'admin/restaurants', component: RestaurantComponent },
  { path: 'admin/restaurants/add', component: AddRestaurantComponent },
  { path: 'admin/restaurants/:name', component: DetailRestaurantComponent },
  { path: 'admin/restaurants/update', component: UpdateRestaurantComponent },
  { path: 'admin/chambres', component: ChambresListComponent },
  {path: 'visiteur/chambres', component: ChambresVisiteurComponent},
  { 
    path: 'reservation-success', 
    component: ReservationSuccessComponent 
  },

  { path: 'admin/restaurants/update/:id', component: UpdateRestaurantComponent },
  { path: 'admin/restaurants/rating/:id', component: RateRestaurantComponent },  
  /*start sayari*/
    { path: 'admin/complaints', component: ComplaintComponent },
   /*end sayari*/
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
