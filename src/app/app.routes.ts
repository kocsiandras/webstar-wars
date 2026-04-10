import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './pages/auth/auth-layout/auth-layout.component';
import { noAuthGuard } from './core/guards/noAuth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { AuthenticatedLayoutComponent } from './core/components/authenticated-layout/authenticated-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AuthenticatedLayoutComponent,
        canActivate: [authGuard],
        children: [
            {path: '', redirectTo: 'character-selector', pathMatch: 'full'},
            {path: 'character-selector', loadComponent: () => import('./pages/character-selector/character-selector.component').then(m => m.CharacterSelectorComponent)},
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        canActivate: [noAuthGuard],
        children: [
            { path: 'login', component: LoginComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' },
        ],
    },
    {
        path: '**',
        redirectTo: 'auth/login',
    }
];
