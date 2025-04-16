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
import { AddActivityComponent } from './pages/activity/add-activity/add-activity.component';
import { ActivityListComponent } from './pages/activity/activity-list/activity-list.component';
import { UpdateActivityComponent } from './pages/activity/update-activity/update-activity.component';
import { ActivityDetailsComponent } from './pages/activity/activity-details/activity-details.component';
import { ActivityCalendarComponent } from './pages/activity/activity-calendar/activity-calendar.component';
import { ActivityListVisiteurComponent } from './pages/activity/activity-list-visiteur/activity-list-visiteur.component';
import { ParticipateActivityComponent } from './pages/activity/participate-activity/participate-activity.component';
import { ActivityStatsComponent } from './pages/activity/activity-stats/activity-stats.component';







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
  { path: 'admin/activities/add', component: AddActivityComponent },
  { path: 'admin/activities/list', component: ActivityListComponent },
  { path: 'admin/activities/update/:id', component: UpdateActivityComponent },
  { path: 'admin/activities/details/:id', component: ActivityDetailsComponent },
  { path: 'admin/activities/calendar', component: ActivityCalendarComponent },
  { path: 'visiteur/activities/list-visiteur', component: ActivityListVisiteurComponent },
  { path: 'visiteur/activities/participate/:id', component: ParticipateActivityComponent },
  { path: 'admin/activities/stats', component: ActivityStatsComponent },






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
