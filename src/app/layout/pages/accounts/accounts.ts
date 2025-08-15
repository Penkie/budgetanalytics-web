import { Component, inject } from '@angular/core';
import { PageHeader } from '../../../common/components/page-header/page-header';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../common/services/account.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-accounts',
    imports: [PageHeader, RouterModule],
    templateUrl: './accounts.html',
    styleUrl: './accounts.scss',
})
export class Accounts {
    private readonly accountService = inject(AccountService);
    public readonly accounts = toSignal(this.accountService.getAccounts(), {
        initialValue: [],
    });
}
