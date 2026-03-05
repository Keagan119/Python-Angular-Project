import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../models/transaction.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  standalone: false
})
export class TransactionsComponent implements OnInit, OnDestroy {
  showAddTransaction = false;
  isLoading = false;
  error: string | null = null;
  transactions: Transaction[] = [];
  private subscriptions: Subscription[] = [];


  newTransaction: Partial<Transaction> = {
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  };

  constructor(
    private service: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleAddTransaction(): void {
    this.showAddTransaction = !this.showAddTransaction;
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.error = null;
    
    console.log('Starting to load transactions...');
    console.log('Current transactions array before loading:', this.transactions);
    
    const sub = this.service.getTransactions().subscribe({
      next: (transactions) => {
        console.log('Transactions loaded from API:', transactions);
        console.log('Transactions array length:', transactions.length);
        console.log('Type of transactions:', typeof transactions);
        console.log('Is array?', Array.isArray(transactions));
        
        
        this.transactions = [...transactions];
        console.log('Transactions array after assignment:', this.transactions);
        console.log('Transactions length after assignment:', this.transactions.length);
        
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error loading transactions:', err);
        this.error = 'Failed to fetch transactions. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Transaction loading complete');
        console.log('Final transactions array:', this.transactions);
        console.log('Final transactions length:', this.transactions.length);
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  saveTransaction(): void {
    console.log('Saving transaction:', this.newTransaction);
    const token = localStorage.getItem('access_token') || undefined;
    const sub = this.service.createTransactionWithAuth(this.newTransaction as Transaction, token).subscribe({
      next: (transaction) => {
        console.log('Transaction created:', transaction);
        
        this.transactions = [transaction, ...this.transactions];
        this.resetForm();
        this.showAddTransaction = false;
       
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error creating transaction:', err);
        this.error = 'Failed to create transaction. Please try again.';
      }
    });
    
    this.subscriptions.push(sub);
  }

  private resetForm(): void {
    this.newTransaction = {
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    };
  }

  
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'housing': '🏠',
      'food': '🍔',
      'transportation': '🚗',
      'entertainment': '🎮',
      'other': '📦'
    };
    return icons[category] || '📦';
  }

  getCategoryName(category: string): string {
    const names: { [key: string]: string } = {
      'housing': '🏠 Housing',
      'food': '🍔 Food & Dining',
      'transportation': '🚗 Transportation',
      'entertainment': '🎮 Entertainment',
      'other': '📦 Other'
    };
    return names[category] || '📦 Other';
  }

  
  editingId: string | null = null;
  editModel: Partial<Transaction> = {};

  startEdit(tx: Transaction): void {
    this.editingId = tx.id;
    this.editModel = { ...tx };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editModel = {};
  }

  saveEdit(): void {
    if (this.editingId == null) return;
    const id = this.editingId;
  
    const payload: Partial<Transaction> = {
      description: this.editModel.description,
      category: this.editModel.category,
      amount: this.editModel.amount
    };

    const sub = this.service.updateTransaction(id, payload).subscribe({
      next: (updated) => {
        const idx = this.transactions.findIndex(t => t.id === id);
        if (idx > -1) {
          this.transactions[idx] = { ...updated } as Transaction;
          this.transactions = [...this.transactions];
        }
        this.cancelEdit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update transaction', err);
        this.error = 'Failed to update transaction. Please try again.';
      }
    });

    this.subscriptions.push(sub);
  }
}
