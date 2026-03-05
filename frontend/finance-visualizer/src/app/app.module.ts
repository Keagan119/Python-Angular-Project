import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CategoryBreakdownComponent } from './components/category-breakdown/category-breakdown.component';
import { TrendsComponent } from './components/trends/trends.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { App } from './app';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    TransactionsComponent,
    CategoryBreakdownComponent,
    TrendsComponent,
    AlertsComponent,
  ],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes), FormsModule],
  providers: [],
  bootstrap: [App],
})
export class AppModule {}
