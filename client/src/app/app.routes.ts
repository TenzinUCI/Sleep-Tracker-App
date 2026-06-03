import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'stats',
    loadComponent: () => import('./pages/stats/stats').then((m) => m.Stats),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
  },
  {
    path: '**',
    redirectTo: '',
  },
];