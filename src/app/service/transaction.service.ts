import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Transaction {
  id: number;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
  date: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor() {
    this.loadTransactions();
  }

  private loadTransactions() {
    const data = localStorage.getItem('transactions');
    if (data) this.transactionsSubject.next(JSON.parse(data));
  }

  saveTransaction(transaction: Omit<Transaction, 'id'>, editingId: number | null = null) {
    let transactions = this.transactionsSubject.getValue();

    if (editingId !== null) {
      const index = transactions.findIndex(t => t.id === editingId);
      if (index !== -1) transactions[index] = { id: editingId, ...transaction };
    } else {
      transactions.push({ id: Date.now(), ...transaction });
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
    this.transactionsSubject.next(transactions);
  }

  deleteTransaction(id: number) {
    let transactions = this.transactionsSubject.getValue();
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    this.transactionsSubject.next(transactions);
  }
}
