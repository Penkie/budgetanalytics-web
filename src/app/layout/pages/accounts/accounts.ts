import { Component } from '@angular/core';
import { PageHeader } from '../../../common/components/page-header/page-header';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-accounts',
    imports: [PageHeader, RouterModule],
    templateUrl: './accounts.html',
    styleUrl: './accounts.scss',
})
export class Accounts {}
