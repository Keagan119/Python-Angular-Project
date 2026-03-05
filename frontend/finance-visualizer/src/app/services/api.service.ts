import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    console.log('Fetching transactions from:', `${this.baseUrl}/transactions`);
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    console.log('Creating transaction at:', `${this.baseUrl}/transactions`, transaction);
    return this.http.post<Transaction>(`${this.baseUrl}/transactions`, transaction);
  }

  
  createTransactionWithAuth(transaction: Transaction, token?: string): Observable<Transaction> {
    const url = `${this.baseUrl}/transactions`;
    console.log('Creating transaction with auth at:', url, transaction);
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post<Transaction>(url, transaction, options);
  }

  updateTransaction(id: number | string, transaction: Partial<Transaction>): Observable<Transaction> {
    console.log('Updating transaction at:', `${this.baseUrl}/transactions/${id}`, transaction);
    return this.http.put<Transaction>(`${this.baseUrl}/transactions/${id}`, transaction);
  }
}
