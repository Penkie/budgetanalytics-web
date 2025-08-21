import {
    Component,
    computed,
    effect,
    Inject,
    inject,
    signal,
} from '@angular/core';
import {
    PageHeader,
    PagePath,
} from '../../../../common/components/page-header/page-header';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AccountService } from '../../../../common/services/account.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    catchError,
    concat,
    delay,
    filter,
    map,
    Observable,
    of,
    startWith,
    Subject,
    switchMap,
    tap,
} from 'rxjs';
import { Account } from '../../../../common/models/account.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../common/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

interface FormState {
    loading: boolean;
    success: boolean;
    error: string | null;
    account: Account | null;
}

@Component({
    selector: 'app-edition',
    imports: [PageHeader, ReactiveFormsModule],
    templateUrl: './edition.html',
    styleUrl: './edition.scss',
})
export class AccountEdition {
    private readonly accountService = inject(AccountService);
    private readonly submitSubject = new Subject<Account>();
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    public isArchived = false;

    public readonly accountId = toSignal(
        this.activatedRoute.paramMap.pipe(map((params) => params.get('id'))),
        { initialValue: null }
    );

    public readonly editMode = computed(() => !!this.accountId());

    public loadAccount = toSignal(
        this.activatedRoute.paramMap.pipe(
            map((params) => params.get('id')),
            filter((id): id is string => !!id),
            switchMap((id) => {
                return this.accountService.getAccountById(id).pipe(
                    catchError((error) => {
                        this.notificationService.error(
                            'Error while loading selected account.'
                        );
                        return of(null);
                    })
                );
            })
        ),
        { initialValue: null }
    );

    public readonly pagePath: Array<PagePath> = [
        {
            name: 'Configuration',
            route: false,
        },
        {
            name: 'Accounts',
            route: true,
            routerLink: '/cockpit/accounts',
        },
        {
            name: this.accountId() ? 'Edit account' : 'Create account',
            route: false,
            main: true,
        },
    ];

    public submitted = signal(false);

    public editForm = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.maxLength(255),
        ]),
        amount: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
    });

    public formState = toSignal(
        this.submitSubject.pipe(
            switchMap((account: Account) =>
                concat(
                    of({
                        loading: true,
                        success: false,
                        error: null,
                        account: null,
                    }),
                    this.editMode()
                        ? this.updateAccount(account)
                        : this.createAccount(account)
                )
            ),
            startWith({
                loading: false,
                success: false,
                error: null,
                account: null,
            })
        ),
        {
            initialValue: {
                loading: false,
                success: false,
                error: null,
                account: null,
            },
        }
    );

    public createAccount(accountData: Account): Observable<FormState> {
        return this.accountService.createAccount(accountData).pipe(
            tap(() => {
                this.notificationService.success(
                    'Account created successfully'
                );
                this.router.navigate(['/cockpit/accounts']);
            }),
            map(
                (createdAccount): FormState => ({
                    success: true,
                    loading: false,
                    error: null,
                    account: createdAccount,
                })
            ),
            catchError((error) => {
                this.displayErrorMessage(error);
                return of({
                    loading: false,
                    success: false,
                    error: 'true',
                    account: null,
                } as FormState);
            })
        );
    }

    public updateAccount(accountData: Account): Observable<FormState> {
        const id = this.accountId();
        const updatedAccount = { ...accountData, id: id as string };

        return this.accountService.updateAccount(updatedAccount).pipe(
            tap(() => {
                this.notificationService.success('Account saved successfully');
                this.router.navigate(['/cockpit/accounts']);
            }),
            map(
                (createdAccount): FormState => ({
                    success: true,
                    loading: false,
                    error: null,
                    account: createdAccount,
                })
            ),
            catchError((error) => {
                this.displayErrorMessage(error);
                return of({
                    loading: false,
                    success: false,
                    error: 'true',
                    account: null,
                } as FormState);
            })
        );
    }

    public submitForm(archive = false): void {
        this.submitted.set(true);

        if (this.editForm.status === 'INVALID') {
            return;
        }

        const account = {
            name: this.editForm.controls.name.value || '',
            amount: Number(this.editForm.controls.amount.value) || 0,
            type: this.editForm.controls.type.value || '',
            archived: archive,
        };

        this.submitSubject.next(account);
    }

    constructor() {
        effect(() => {
            const account = this.loadAccount();
            if (account && this.editMode()) {
                if (account.archived) {
                    this.isArchived = true;
                }
                this.editForm.patchValue({
                    name: account.name,
                    type: account.type,
                    amount: account.amount.toString(),
                });
            }
        });
    }

    private displayErrorMessage(error: HttpErrorResponse): void {
        if (error.status === 400) {
            this.notificationService.error(
                error.error?.message || 'Invalid data.'
            );
        }
        if (error.status === 500) {
            this.notificationService.error(
                error.error?.message ||
                    'Something went wrong with our servers. Please try again later or contact us.'
            );
        } else {
            this.notificationService.error(
                error.error?.message || 'Something went wrong.'
            );
        }
    }
}
