import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Importer ici
  // Import ToastrModule


// calendar
import { FullCalendarModule } from '@fullcalendar/angular'; // Already imported FullCalendarModule
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // Import the required plugin

// dashboard components
import { LayoutComponent } from './dashboard/layout/layout.component';
import { TopBarComponent } from './dashboard/top-bar/top-bar.component';
import { OverlayComponent } from './dashboard/overlay/overlay.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar/sidebar.component';
import { SidebarItemComponent } from './dashboard/sidebar/sidebar-item/sidebar-item.component';
import { SidebarItemsComponent } from './dashboard/sidebar/sidebar-items/sidebar-items.component';
import { SidebarHeaderComponent } from './dashboard/sidebar/sidebar-header/sidebar-header.component';

// pages
import { HomeComponent } from './pages/home/home.component';
import { CreditComponent } from './pages/credit/credit.component';
import { StatusComponent } from './pages/status/status.component';
import { ArchiveComponent } from './pages/archive/archive.component';
import { SettingsComponent } from './pages/settings/settings.component';

// icons
import { HomeIconComponent } from './dashboard/icons/home-icon/home-icon.component';
import { CreditIconComponent } from './dashboard/icons/credit-icon/credit-icon.component';
import { StatusIconComponent } from './dashboard/icons/status-icon/status-icon.component';
import { ArchiveIconComponent } from './dashboard/icons/archive-icon/archive-icon.component';
import { SettingsIconComponent } from './dashboard/icons/settings-icon/settings-icon.component';

// restaurant pages
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { AddRestaurantComponent } from './pages/restaurant/add-restaurant/add-restaurant.component';
import { DetailRestaurantComponent } from './pages/restaurant/detail-restaurant/detail-restaurant.component';
import { UpdateRestaurantComponent } from './pages/restaurant/update-restaurant/update-restaurant.component';
import { ChambresListComponent } from './pages/chambres-list/chambres-list.component';
import { ChambresVisiteurComponent } from './pages/chambres-visiteur/chambres-visiteur.component';
import { ReservationSuccessComponent } from './pages/reservation-success/reservation-success.component';


// activity pages
import { AddActivityComponent } from './pages/activity/add-activity/add-activity.component';
import { ActivityListComponent } from './pages/activity/activity-list/activity-list.component';
import { UpdateActivityComponent } from './pages/activity/update-activity/update-activity.component';
import { ActivityDetailsComponent } from './pages/activity/activity-details/activity-details.component';
import { ActivityCalendarComponent } from './pages/activity/activity-calendar/activity-calendar.component';

// forms
import { ReactiveFormsModule } from '@angular/forms';
import { ActivityListVisiteurComponent } from './pages/activity/activity-list-visiteur/activity-list-visiteur.component';
import { ParticipateActivityComponent } from './pages/activity/participate-activity/participate-activity.component';
import { ActivityStatsComponent } from './pages/activity/activity-stats/activity-stats.component';




@NgModule({
  declarations: [
    AppComponent,

    // dashboard
    LayoutComponent,
    TopBarComponent,
    OverlayComponent,
    SidebarComponent,
    SidebarItemComponent,
    SidebarItemsComponent,
    SidebarHeaderComponent,

    // pages
    HomeComponent,
    CreditComponent,
    StatusComponent,
    ArchiveComponent,
    SettingsComponent,

    // icons
    HomeIconComponent,
    ArchiveIconComponent,
    CreditIconComponent,
    StatusIconComponent,
    SettingsIconComponent,

    // restaurant
    RestaurantComponent,
    AddRestaurantComponent,
    DetailRestaurantComponent,
    UpdateRestaurantComponent,

    // activities
    AddActivityComponent,
    ActivityListComponent,
    UpdateActivityComponent,
    ActivityDetailsComponent,
    ActivityCalendarComponent,
    ActivityListVisiteurComponent,
    ParticipateActivityComponent,
    ActivityStatsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule, 
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
     // ✅ Ajouter ici


  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
