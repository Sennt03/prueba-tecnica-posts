import { Routes } from "@angular/router";
import { Auth } from "./auth";

export const AuthRoutes: Routes = [
    {
        path: '',
        component: Auth,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./login/login').then(c => c.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('./register/register').then(c => c.Register)
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    },
]