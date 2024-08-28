import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@components/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
  },
  {
    path: 'canvas',
    loadComponent: () =>
      import('@components/canvas/canvas.component').then(
        (mod) => mod.CanvasComponent
      ),
  },
];
