import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../../common/components/page-header/page-header';
import { RouterModule } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../../common/services/transaction.service';
import { endOfMonth, startOfMonth } from 'date-fns';
import { map, switchMap } from 'rxjs';
import { AccountService } from '../../../common/services/account.service';
import { CategoryService } from '../../../common/services/categorie.service';

@Component({
    selector: 'app-mouvements',
    imports: [PageHeader, RouterModule],
    templateUrl: './mouvements.html',
    styleUrl: './mouvements.scss',
})
export class Mouvements {
    private readonly transactionService = inject(TransactionService);
    private readonly accountService = inject(AccountService);
    private readonly categoryService = inject(CategoryService);

    private searchParams = signal({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
        page: 0,
        size: 20,
    });

    public accounts = toSignal(this.accountService.getAccounts(), {
        initialValue: [],
    });
    public categories = toSignal(this.categoryService.getCategories(), {
        initialValue: [],
    });

    public transactions = toSignal(
        toObservable(this.searchParams).pipe(
            switchMap((params) => {
                return this.transactionService
                    .getTransactions(
                        params.startDate,
                        params.endDate,
                        params.page,
                        params.size
                    )
                    .pipe(map((res) => res.content));
            })
        ),
        { initialValue: null, requireSync: false }
    );

    public transactionsWithDetails = computed(() => {
        const transactions = this.transactions();
        const accounts = this.accounts();
        const categories = this.categories();

        if (!transactions || !accounts || !categories) {
            return;
        }

        const accountMap = new Map(
            accounts.map((account) => [account.id, account])
        );
        const categoryMap = new Map(
            categories.map((category) => [category.id, category])
        );

        return transactions.map((transaction) => ({
            ...transaction,
            account: accountMap.get(transaction.accountId),
            category: categoryMap.get(transaction.categoryId),
        }));
    });

    public readonly skeletonCount = Array.from({ length: 1 }, (_, i) => i);
    public isLoading = computed(() => this.transactions() === null);
}
