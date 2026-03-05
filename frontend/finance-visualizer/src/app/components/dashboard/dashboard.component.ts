import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { KPIs } from '../../models/kpi.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  kpis: KPIs | null = null;
  isLoading = false;
  error: string | null = null;
  
  
  private userId = 1;
  
  constructor(
    private router: Router,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadKPIs();
  }

  loadKPIs(): void {
    console.log('Starting to load KPIs...');
    this.isLoading = true;
    this.error = null;
    
    this.analyticsService.fetchKPIs(this.userId).subscribe({
      next: (data) => {
        console.log('KPI data received:', data);
        this.kpis = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading KPIs:', err);
        this.error = 'Failed to load KPI data';
        this.isLoading = false;
      }
    });
  }

  addTransaction(): void {
   
    this.router.navigate(['/transactions']);
  }
}
