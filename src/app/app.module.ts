import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';


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
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { LoginComponent } from './pages/user/login/login.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { SpaListComponent } from './pages/spa/spa-list/spa-list.component';

// icons
import { HomeIconComponent } from './dashboard/icons/home-icon/home-icon.component';
import { CreditIconComponent } from './dashboard/icons/credit-icon/credit-icon.component';
import { StatusIconComponent } from './dashboard/icons/status-icon/status-icon.component';
import { ArchiveIconComponent } from './dashboard/icons/archive-icon/archive-icon.component';
import { SettingsIconComponent } from './dashboard/icons/settings-icon/settings-icon.component';
import { ComplaintIconComponent } from './dashboard/icons/complaint-icon/complaint-icon.component';
import { UserIconComponent } from './dashboard/icons/user-icon/user-icon.component';
import { SpaIconComponent } from './dashboard/icons/spa-icon/spa-icon.component';

import { RestaurantIconComponent } from './shared/icons/restaurant-icon/restaurant-icon.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { AddRestaurantComponent } from './pages/restaurant/add-restaurant/add-restaurant.component';
import { DetailRestaurantComponent } from './pages/restaurant/detail-restaurant/detail-restaurant.component';
import { UpdateRestaurantComponent } from './pages/restaurant/update-restaurant/update-restaurant.component';
import { ChambresListComponent } from './pages/chambres-list/chambres-list.component';
import { ChambresVisiteurComponent } from './pages/chambres-visiteur/chambres-visiteur.component';
import { ReservationSuccessComponent } from './pages/reservation-success/reservation-success.component';

import { AddTableModalComponent } from './pages/restaurant/detail-restaurant/add-table-modal/add-table-modal.component';
import { RateRestaurantComponent } from './pages/restaurant/rate-restaurant/rate-restaurant.component';
import { ComplaintComponent } from './pages/complaint/complaint.component';

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
    ComplaintComponent,
    UserListComponent,
    LoginComponent,
    ProfileComponent,
    SpaListComponent,
    RestaurantComponent,
    AddRestaurantComponent,
    DetailRestaurantComponent,
    UpdateRestaurantComponent,
    AddTableModalComponent,
    RateRestaurantComponent,

    // icons
    HomeIconComponent,
    ArchiveIconComponent,
    CreditIconComponent,
    StatusIconComponent,
    SettingsIconComponent,
    RestaurantComponent,
    AddRestaurantComponent,
    DetailRestaurantComponent,
    UpdateRestaurantComponent,
    ChambresListComponent,
    ChambresVisiteurComponent,
    ReservationSuccessComponent,
    

    ComplaintIconComponent,
    RestaurantIconComponent,
    UserIconComponent,
    SpaIconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}