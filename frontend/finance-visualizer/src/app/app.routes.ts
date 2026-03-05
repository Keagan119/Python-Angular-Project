import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CategoryBreakdownComponent } from './components/category-breakdown/category-breakdown.component';
import { TrendsComponent } from './components/trends/trends.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
	{ path: 'categories', component: CategoryBreakdownComponent, canActivate: [AuthGuard] },
	{ path: 'trends', component: TrendsComponent, canActivate: [AuthGuard] },
	{ path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/login' }
];
