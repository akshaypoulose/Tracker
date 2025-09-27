import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { TransactionService, Transaction } from '../service/transaction.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('financeChart') financeChart!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {
    // Subscribe to live transactions
    this.transactionService.transactions$.subscribe(data => {
      this.transactions = data;
      this.updateChart(); // Update pie chart automatically
    });
  }

  ngAfterViewInit(): void {
    this.createChart(); // Initialize chart
  }

  // Summary getters
  get totalIncome(): number {
    return this.transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpense(): number {
    return this.transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  }

  get balance(): number {
    return this.totalIncome - this.totalExpense;
  }

  get averageIncome(): number {
    return this.totalIncome / 12;
  }

  get averageExpense(): number {
    return this.totalExpense / 12;
  }

  // Create pie chart with all metrics
  createChart() {
    const ctx = this.financeChart.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          'Total Income', 
          'Total Expense', 
          'Balance', 
          'Avg Income/Month', 
          'Avg Expense/Month'
        ],
        datasets: [{
          label: 'Financial Overview',
          data: [
            this.totalIncome,
            this.totalExpense,
            this.balance,
            this.averageIncome,
            this.averageExpense
          ],
          backgroundColor: ['hsl(268, 59%, 25%)', '#5c94c2', '#263357', '#5e4574', '#bb7cee'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  // Update chart dynamically
  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [
        this.totalIncome,
        this.totalExpense,
        this.balance,
        this.averageIncome,
        this.averageExpense
      ];
      this.chart.update();
    }
  }
}
