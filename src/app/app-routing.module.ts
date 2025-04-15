import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { CreditComponent } from './pages/credit/credit.component';
import { StatusComponent } from './pages/status/status.component';
import { ArchiveComponent } from './pages/archive/archive.component';
import { SettingsComponent } from './pages/settings/settings.component';
import {RestaurantComponent} from "./pages/restaurant/restaurant.component";
import {AddRestaurantComponent} from "./pages/restaurant/add-restaurant/add-restaurant.component";
import {DetailRestaurantComponent} from "./pages/restaurant/detail-restaurant/detail-restaurant.component";
import {UpdateRestaurantComponent} from "./pages/restaurant/update-restaurant/update-restaurant.component";
import {ChambresListComponent} from "./pages/chambres-list/chambres-list.component";
import { ChambresVisiteurComponent } from './pages/chambres-visiteur/chambres-visiteur.component';
import { ReservationSuccessComponent } from './pages/reservation-success/reservation-success.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin/status', component: StatusComponent },
  { path: 'admin/archives', component: ArchiveComponent },
  { path: 'admin/credits', component: CreditComponent },
  { path: 'admin/settings', component: SettingsComponent },
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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
