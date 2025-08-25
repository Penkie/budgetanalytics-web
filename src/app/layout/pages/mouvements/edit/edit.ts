import { Component, computed, effect, inject, signal } from '@angular/core';
import {
    PageHeader,
    PagePath,
} from '../../../../common/components/page-header/page-header';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, from, map, Observable, of, switchMap } from 'rxjs';
import { AccountService } from '../../../../common/services/account.service';
import { CategoryService } from '../../../../common/services/categorie.service';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Transaction } from '../../../../common/models/transaction.model';
import { TransactionService } from '../../../../common/services/transaction.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { format, formatDate } from 'date-fns';

@Component({
    selector: 'app-edit',
    imports: [PageHeader, ReactiveFormsModule],
    templateUrl: './edit.html',
    styleUrl: './edit.scss',
})
export class EditMouvement {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly accountsService = inject(AccountService);
    private readonly categoryService = inject(CategoryService);
    private readonly notificationService = inject(NotificationService);
    private readonly transactionService = inject(TransactionService);
    private readonly router = inject(Router);
    private readonly transactionId = toSignal(
        this.activatedRoute.paramMap.pipe(map((param) => param.get('id'))),
        { initialValue: null }
    );
    private readonly transaction = toSignal(
        this.activatedRoute.paramMap.pipe(
            map((params) => params.get('id')),
            filter((id): id is string => !!id),
            switchMap((id) => {
                return this.transactionService.getTransactionById(id).pipe(
                    catchError(() => {
                        this.notificationService.error(
                            'Something went wrong loading your mouvement.'
                        );
                        return of(null);
                    })
                );
            })
        ),
        { initialValue: null }
    );

    public readonly selectedType = signal('expense');
    public readonly selectedAccount = signal('');
    public readonly selectedCategory = signal('');

    public readonly editMode = computed(() => !!this.transactionId());

    public readonly accounts = toSignal(this.accountsService.getAccounts(), {
        initialValue: null,
        requireSync: false,
    });
    public readonly categories = toSignal(
        this.categoryService.getCategories(),
        { initialValue: null, requireSync: false }
    );

    public readonly pagePath: Array<PagePath> = [
        {
            name: 'Mouvements',
            route: true,
            routerLink: '/cockpit/mouvements',
        },
        {
            name: this.transactionId() ? 'Edit mouvement' : 'Create mouvement',
            route: false,
            main: true,
        },
    ];

    public readonly submitted = signal(false);

    public editForm = new FormGroup({
        type: new FormControl('', Validators.required),
        amount: new FormControl(0, [Validators.required]),
        description: new FormControl('', [
            Validators.required,
            Validators.maxLength(1000),
        ]),
        date: new FormControl(
            formatDate(new Date(), 'yyyy-MM-dd'),
            Validators.required
        ),
        accountId: new FormControl('', Validators.required),
        categoryId: new FormControl('', Validators.required),
    });

    public submitForm(stay = false): void {
        this.submitted.set(true);

        if (this.editForm.status === 'INVALID') {
            return;
        }

        const amountFormValue = this.editForm.controls.amount.value || 0;
        const amount =
            this.selectedType() == 'expense'
                ? amountFormValue * -1
                : amountFormValue;

        const transaction = {
            description: this.editForm.controls.description.value || '',
            amount: amount || 0,
            date: this.editForm.controls.date.value || '',
            categoryId: this.editForm.controls.categoryId.value || '',
            accountId: this.editForm.controls.accountId.value || '',
        };

        // condition if editMode is on
        const obs = this.editMode()
            ? this.updateTransaction(transaction)
            : this.transactionService.createTransaction(transaction);

        obs.pipe(
            catchError(() => {
                // send notification
                this.notificationService.error('Something went wrong.');
                return of(null);
            })
        ).subscribe({
            next: (transaction) => {
                if (transaction) {
                    this.notificationService.success(
                        'Mouvement saved successfully'
                    );
                    if (stay) {
                        this.editForm.reset();
                        this.selectedType.set(this.selectedType());
                        this.selectedAccount.set('');
                        this.selectedCategory.set('');
                        this.submitted.set(false);
                    } else {
                        this.router.navigate(['/cockpit/mouvements']);
                    }
                }
            },
        });
    }

    public updateTransaction(
        transaction: Transaction
    ): Observable<Transaction> {
        const id = this.transactionId();
        const updatedTranscation = { ...transaction, id: id as string };
        return this.transactionService.updateTransaction(updatedTranscation);
    }

    public createTransaction(
        transaction: Transaction
    ): Observable<Transaction> {
        return this.transactionService.createTransaction(transaction);
    }

    constructor() {
        effect(() => {
            const editMode = this.editMode();
            const transaction = this.transaction();

            if (editMode && transaction) {
                if (transaction.amount < 0) {
                    transaction.amount *= -1;
                    this.selectedType.set('expense');
                } else {
                    this.selectedType.set('income');
                }

                this.selectedAccount.set(transaction.accountId);
                this.selectedCategory.set(transaction.categoryId);

                this.editForm.patchValue({
                    description: transaction.description,
                    amount: transaction.amount,
                    date: format(transaction.date, 'yyyy-MM-dd'),
                });
            }
        });

        effect(() => {
            this.selectedAccount;
            this.selectedCategory;
            this.selectedType;

            this.editForm.patchValue({
                type: this.selectedType(),
                accountId: this.selectedAccount(),
                categoryId: this.selectedCategory(),
            });
        });
    }
}
