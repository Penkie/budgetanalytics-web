import { Component, inject } from '@angular/core';
import { TransactionService } from '../../../common/services/transaction.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-transactions',
    imports: [],
    templateUrl: './transactions.html',
    styleUrl: './transactions.scss',
})
export class TransactionsComponent {
    private readonly transactionService = inject(TransactionService);

    readonly transactions = toSignal(
        this.transactionService.getTransactions(new Date(), new Date(), 0, 20),
        { initialValue: [] }
    );
}
