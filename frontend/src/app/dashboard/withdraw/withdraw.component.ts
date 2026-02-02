import { Component, EventEmitter, Output } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
})
export class WithdrawComponent {
  amount: number | null = null;
  loading = false;
  error: string | null = null;

  @Output() success = new EventEmitter<void>();

  constructor(private dashboardService: DashboardService) {}

  withdraw(): void {
    if (!this.amount || this.amount <= 0) {
      this.error = 'Enter a valid amount';
      return;
    }

    this.loading = true;
    this.error = null;

    this.dashboardService.withdraw(this.amount).subscribe({
      next: () => {
        this.amount = null;
        this.loading = false;
        this.success.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Withdraw failed';
      },
    });
  }
}
