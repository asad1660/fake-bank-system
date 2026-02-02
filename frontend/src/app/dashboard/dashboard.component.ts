import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { AuthService } from '../auth/auth.service';
export type ActionView = 'deposit' | 'withdraw' | 'transactions' | null;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  balance: number | null = null;
  loading = true;
  activeView: ActionView = null;
  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadBalance();
  }
  logout(): void {
    this.authService.logout();
  }
  loadBalance(): void {
    this.dashboardService.getBalance().subscribe({
      next: (balance) => {
        this.balance = balance;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  selectFeature(val: ActionView): void {
    this.activeView = val;
  }

  onTransactionSuccess(): void {
    this.activeView = null;
    this.loadBalance(); // this is for refresh .... after transaction
  }
}
