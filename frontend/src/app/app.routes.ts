import { Routes } from '@angular/router';
import { authGuard } from '@shared/guards/auth-guard';
import { noAuthGuard } from '@shared/guards/no-auth-guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AuthRoutes),
        canActivate: [noAuthGuard]
    },
    {
        path: '',
        loadChildren: () => import('./home/home.routes').then(m => m.HomeRoutes),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/auth'
    }
];
