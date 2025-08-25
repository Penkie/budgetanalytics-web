import { Component, inject, signal } from '@angular/core';
import {
    PageHeader,
    PagePath,
} from '../../../../common/components/page-header/page-header';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AccountService } from '../../../../common/services/account.service';
import { CategoryService } from '../../../../common/services/categorie.service';

@Component({
    selector: 'app-edit',
    imports: [PageHeader],
    templateUrl: './edit.html',
    styleUrl: './edit.scss',
})
export class EditMouvement {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly accountsService = inject(AccountService);
    private readonly categoryService = inject(CategoryService);
    private readonly transactionId = toSignal(
        this.activatedRoute.paramMap.pipe(map((param) => param.get('id'))),
        { initialValue: null }
    );

    public readonly selectedType = signal('expense');
    public readonly selectedAccount = signal('');
    public readonly selectedCategory = signal('');

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
}
