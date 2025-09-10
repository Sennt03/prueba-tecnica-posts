import { Routes } from "@angular/router";
import { Home } from "./home";

export const HomeRoutes: Routes = [
    {
        path: '',
        component: Home,
        children: [
            {
                path: '',
                loadComponent: () => import('./posts/posts').then(c => c.Posts)
            },
            {
                path: 'create',
                loadComponent: () => import('./new-post/new-post').then(c => c.NewPost)
            },
            {
                path: 'update/:id',
                loadComponent: () => import('./new-post/new-post').then(c => c.NewPost)
            },
        ]
    }
]