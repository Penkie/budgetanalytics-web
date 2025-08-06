import { Component } from '@angular/core';
import { TransactionsComponent } from './widgets/transactions/transactions';

@Component({
    selector: 'app-dashboard',
    imports: [TransactionsComponent],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {}
