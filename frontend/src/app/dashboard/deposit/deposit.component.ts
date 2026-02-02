import { Component, EventEmitter, Output } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent {
  amount: number | null = null;
  loading = false;
  error: string | null = null;

  @Output() success = new EventEmitter<void>();

  constructor(private dashboardService: DashboardService) {}

  deposit(): void {
    if (!this.amount || this.amount <= 0) {
      this.error = 'Enter a valid amount';
      return;
    }

    this.loading = true;
    this.error = null;

    this.dashboardService.deposit(this.amount).subscribe({
      next: () => {
        this.amount = null;
        this.loading = false;
        this.success.emit(); // for notifying  dashboard..
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Deposit failed';
      },
    });
  }
}
