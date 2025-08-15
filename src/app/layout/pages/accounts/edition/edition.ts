import { Component, inject, signal } from '@angular/core';
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
    map,
    of,
    startWith,
    Subject,
    switchMap,
} from 'rxjs';
import { Account } from '../../../../common/models/account.model';
import { HttpErrorResponse } from '@angular/common/http';

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
            name: 'Create account',
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
                    this.accountService.createAccount(account).pipe(
                        map(
                            (createdAccount): FormState => ({
                                success: true,
                                loading: false,
                                error: null,
                                account: createdAccount,
                            })
                        ),
                        catchError((error) =>
                            of({
                                loading: false,
                                success: false,
                                error: this.getErrorMessage(error),
                                account: null,
                            } as FormState)
                        )
                    )
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

    public submitForm(): void {
        this.submitted.set(true);

        if (this.editForm.status === 'INVALID') {
            return;
        }

        const account = {
            name: this.editForm.controls.name.value || '',
            amount: Number(this.editForm.controls.amount.value) || 0,
            type: this.editForm.controls.type.value || '',
        };

        this.submitSubject.next(account);
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        if (error.status === 400) {
            return 'Invalid data.';
        }
        if (error.status === 500) {
            return 'Something went wrong with our servers. Please try again later or contact us.';
        }
        return error.error?.message || 'Something went wrong.';
    }
}
