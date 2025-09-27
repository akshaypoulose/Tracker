import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TransactionService, Transaction } from '../service/transaction.service';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent {
  filterForm: FormGroup;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  types = ['Income', 'Expense'];
  incomeCategories = ['Salary', 'Misc', 'Investments', 'Other'];
  expenseCategories = ['Food', 'Transport', 'Bills', 'Rent', 'Misc'];

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {
    this.filterForm = this.fb.group({
      type: ['All'],
      category: ['All'],
      startDate: [''],
      endDate: [''],
      sortBy: ['date']
    });

    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
      this.applyFilters();
    });
  }

  get categories() {
    const type = this.filterForm.get('type')?.value;
    if (type === 'Income') return this.incomeCategories;
    if (type === 'Expense') return this.expenseCategories;
    return [...this.incomeCategories, ...this.expenseCategories];
  }

  applyFilters() {
    let temp = [...this.transactions];
    const type = this.filterForm.get('type')?.value;
    const category = this.filterForm.get('category')?.value;
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;
    const sortBy = this.filterForm.get('sortBy')?.value;

    if (type !== 'All') temp = temp.filter(t => t.type === type);
    if (category !== 'All') temp = temp.filter(t => t.category === category);
    if (startDate) temp = temp.filter(t => new Date(t.date) >= new Date(startDate));
    if (endDate) temp = temp.filter(t => new Date(t.date) <= new Date(endDate));

    if (sortBy === 'amount') temp.sort((a, b) => a.amount - b.amount);
    else temp.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.filteredTransactions = temp;
  }

  resetFilters() {
    this.filterForm.reset({ type: 'All', category: 'All', startDate: '', endDate: '', sortBy: 'date' });
    this.applyFilters();
  }
}
