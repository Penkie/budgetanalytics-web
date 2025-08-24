import { Component, inject } from '@angular/core';
import {
    PageHeader,
    PagePath,
} from '../../../../common/components/page-header/page-header';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
    selector: 'app-edit',
    imports: [PageHeader],
    templateUrl: './edit.html',
    styleUrl: './edit.scss',
})
export class EditMouvement {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly transactionId = toSignal(
        this.activatedRoute.paramMap.pipe(map((param) => param.get('id'))),
        { initialValue: null }
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
