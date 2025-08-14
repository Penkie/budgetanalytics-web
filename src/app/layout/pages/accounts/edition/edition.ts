import { Component } from '@angular/core';
import {
    PageHeader,
    PagePath,
} from '../../../../common/components/page-header/page-header';

@Component({
    selector: 'app-edition',
    imports: [PageHeader],
    templateUrl: './edition.html',
    styleUrl: './edition.scss',
})
export class AccountEdition {
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
            name: 'Edition',
            route: false,
            main: true,
        },
    ];
}
