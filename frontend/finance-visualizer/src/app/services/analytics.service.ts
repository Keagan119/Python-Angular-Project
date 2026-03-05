import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Insight } from '../models/insight.model';
import { KPIs } from '../models/kpi.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  fetchKPIs(userId: number): Observable<KPIs> {
    const token = localStorage.getItem('access_token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
  
    
    return this.http.get<KPIs>(`${this.apiUrl}/analytics/kpis?user_id=${userId}`, { headers });
  }


  fetchInsights(): Observable<Insight[]> {
    return of([]);
  }
}
