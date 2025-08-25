import { Component, computed, effect, inject, signal } from '@angular/core';
import {
    PageHeader,
    PagePath,
} from '../../../../common/components/page-header/page-header';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, from, map, Observable, of } from 'rxjs';
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
        date: new FormControl(null, Validators.required),
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
            date: this.editForm.controls.date.value || new Date(),
            categoryId: this.editForm.controls.categoryId.value || '',
            accountId: this.editForm.controls.accountId.value || '',
        };

        // condition if editMode is on
        const obs = this.editMode()
            ? this.transactionService.updateTransaction(transaction)
            : this.transactionService.createTransaction(transaction);

        obs.pipe(
            catchError(() => {
                // send notification
                this.notificationService.error('Something went wrong.');
                return of(null);
            })
        ).subscribe({
            next: () => {
                if (stay) {
                    this.editForm.reset();
                    this.selectedType.set(this.selectedType());
                } else {
                    this.notificationService.success(
                        'Mouvement saved successfully'
                    );
                    this.router.navigate(['/cockpit/mouvements']);
                }
            },
        });
    }

    public createTransaction(
        transaction: Transaction
    ): Observable<Transaction> {
        return this.transactionService.createTransaction(transaction);
    }

    constructor() {
        effect(() => {
            const editMode = this.editMode();

            if (editMode) {
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
