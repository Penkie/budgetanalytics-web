import { Component, computed, inject } from '@angular/core';
import { PageHeader } from '../../../common/components/page-header/page-header';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../../common/services/transaction.service';
import { endOfMonth, startOfMonth } from 'date-fns';
import { map } from 'rxjs';

@Component({
    selector: 'app-mouvements',
    imports: [PageHeader, RouterModule],
    templateUrl: './mouvements.html',
    styleUrl: './mouvements.scss',
})
export class Mouvements {
    private readonly transactionService = inject(TransactionService);

    public transactions = toSignal(
        this.transactionService
            .getTransactions(
                startOfMonth(new Date()),
                endOfMonth(new Date()),
                0,
                20
            )
            .pipe(map((transactions) => transactions.content)),
        { initialValue: null, requireSync: false }
    );
    public readonly skeletonCount = Array.from({ length: 1 }, (_, i) => i);
    public isLoading = computed(() => this.transactions() === null);
}
