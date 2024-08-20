import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CallbackComponent } from './components/callback/callback.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'callback', component: CallbackComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '' }
];
