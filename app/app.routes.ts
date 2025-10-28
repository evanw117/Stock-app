// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { AuthGuard } from './auth/auth.guard';  // <-- your existing guard import

export const routes: Routes = [
  // Redirect empty path to /home
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  // Protected Home route
  {
    path: 'home',
    component: HomePage,
    canActivate: [AuthGuard]
  },

  // Protected Search route
  {
    path: 'search',
    loadComponent: () => import('./search/search.page').then(m => m.SearchPage),
    canActivate: [AuthGuard]
  },

  // Protected Settings route
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage),
    canActivate: [AuthGuard]
  },

  // Protected Chart route
  {
    path: 'chart/:symbol',
    loadComponent: () => import('./chart/chart.page').then(m => m.ChartPage),
    canActivate: [AuthGuard]
  },

  // Public Login & Register routes
  {
    path: 'login',
    loadComponent: () => import('./auth/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register.page').then(m => m.RegisterPage)
  },

  // Fallback
  { path: '**', redirectTo: 'home' }
];
