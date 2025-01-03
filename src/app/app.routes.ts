import { Routes } from '@angular/router';
import { SignInComponent } from './modules/auth/sign-in/sign-in.component';
import { HomeComponent } from './modules/home/home/home.component';
import { AuthGuard } from './auth.guard';
import { IsAdmin } from './IsAdmin.guard';
import { AddInfoComponent } from './modules/admin/add-info/add-info.component';
import { InfoDetailsComponent } from './modules/admin/info-details/info-details.component';
import { CategoriesComponent } from './modules/admin/categories/categories.component';

export const routes: Routes = [
  { path: 'login', component: SignInComponent },
  { path: 'admin', component: AddInfoComponent, canActivate: [AuthGuard] },
  { path: 'info/add', component: AddInfoComponent, canActivate: [AuthGuard] },
  {
    path: 'category',
    component: CategoriesComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'info/update/:id',
    component: AddInfoComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'info/:id',
    component: InfoDetailsComponent,
    canActivate: [AuthGuard],
  },

  // { path: 'admin', component: AddInfoComponent, canActivate: [IsAdmin] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
  // { path: 'info/:id', component: InfoDetailsComponent },
];
