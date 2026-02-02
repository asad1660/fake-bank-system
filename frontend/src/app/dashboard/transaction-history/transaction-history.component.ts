import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DashboardService, Transaction } from '../dashboard.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['type', 'amount', 'balanceAfter', 'createdAt'];

  dataSource = new MatTableDataSource<Transaction>();
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.dashboardService.getTransactions().subscribe({
      next: (transactions) => {
        this.dataSource.data = transactions;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'createdAt') {
        return new Date(item.createdAt).getTime();
      }
      return (item as any)[property];
    };

    Promise.resolve().then(() => {
      this.sort.active = 'createdAt';
      this.sort.direction = 'desc';
      this.sort.sortChange.emit();
      this.cdr.detectChanges();
    });
  }
}
