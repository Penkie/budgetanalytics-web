import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../../common/components/page-header/page-header';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../common/services/account.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-accounts',
    imports: [PageHeader, RouterModule, FormsModule],
    templateUrl: './accounts.html',
    styleUrl: './accounts.scss',
})
export class Accounts {
    private readonly accountService = inject(AccountService);
    private readonly allAccounts = toSignal(this.accountService.getAccounts(), {
        initialValue: [],
    });

    public readonly displayArchived = signal(false);
    public readonly accounts = computed(() => {
        const accounts = this.allAccounts();
        const showArchived = this.displayArchived();
        return accounts.filter((account) =>
            showArchived ? account : account.archived != true
        );
    });

    public readonly accountsArchivedCount = computed(() => {
        return this.allAccounts().filter((a) => a.archived).length;
    });
}
