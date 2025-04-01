import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { CreditComponent } from './pages/credit/credit.component';
import { StatusComponent } from './pages/status/status.component';
import { ArchiveComponent } from './pages/archive/archive.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ComplaintComponent } from './pages/complaint/complaint.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin/status', component: StatusComponent },
  { path: 'admin/archives', component: ArchiveComponent },
  { path: 'admin/credits', component: CreditComponent },
  { path: 'admin/settings', component: SettingsComponent },
  { path: 'admin/complaints', component: ComplaintComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
