import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AuthRoutes)
    },
    {
        path: '',
        loadChildren: () => import('./home/home.routes').then(m => m.HomeRoutes)
    },
    {
        path: '**',
        redirectTo: '/auth'
    }
];
