import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService, Transaction } from '../service/transaction.service';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  transactionForm: FormGroup;
  transactions: Transaction[] = [];
  editingId: number | null = null;

  incomeCategories = ['Salary', 'Misc', 'Investments', 'Other'];
  expenseCategories = ['Food', 'Transport', 'Bills', 'Rent', 'Misc'];

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      type: ['Income', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      description: ['']
    });

    this.transactionService.transactions$.subscribe(data => this.transactions = data);
  }

  get categories() {
    return this.transactionForm.get('type')?.value === 'Income'
      ? this.incomeCategories
      : this.expenseCategories;
  }

  onSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    // Only pass form values (no id)
    const transactionData = this.transactionForm.value;

    this.transactionService.saveTransaction(transactionData, this.editingId);
    this.editingId = null;
    this.transactionForm.reset({ type: 'Income' });
  }

  editTransaction(t: Transaction) {
    this.editingId = t.id;
    this.transactionForm.setValue({
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.date,
      description: t.description || ''
    });
  }

  deleteTransaction(t: Transaction) {
    this.transactionService.deleteTransaction(t.id);
  }

  get totalIncome() {
    return this.transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpense() {
    return this.transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get balance() {
    return this.totalIncome - this.totalExpense;
  }
}
