import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../../common/components/page-header/page-header';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../common/services/account.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, filter, map, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../common/services/notification.service';

@Component({
    selector: 'app-accounts',
    imports: [PageHeader, RouterModule, FormsModule],
    templateUrl: './accounts.html',
    styleUrl: './accounts.scss',
})
export class Accounts {
    private readonly accountService = inject(AccountService);
    private readonly allAccounts = toSignal(
        this.accountService.getAccounts().pipe(
            catchError(() => {
                this.notificationService.error(
                    'Something went wrong while loading your accounts.'
                );
                return of(null);
            })
        ),
        {
            initialValue: null,
            requireSync: false,
        }
    );
    private readonly notificationService = inject(NotificationService);

    public readonly skeletonCount = Array.from({ length: 1 }, (_, i) => i);

    public readonly isLoading = computed(() => this.allAccounts() === null);

    public readonly displayArchived = signal(false);
    public readonly accounts = computed(() => {
        const accounts = this.allAccounts();
        const showArchived = this.displayArchived();
        if (accounts) {
            return accounts.filter((account) =>
                showArchived ? account : account.archived != true
            );
        }
        return [];
    });

    public readonly accountsArchivedCount = computed(() => {
        const accounts = this.allAccounts();
        if (accounts) {
            return accounts.filter((a) => a.archived).length;
        }
        return 0;
    });
}
