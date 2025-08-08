import { Component, input } from '@angular/core';

@Component({
    selector: 'page-header',
    imports: [],
    templateUrl: './page-header.html',
    styleUrl: './page-header.scss',
})
export class PageHeader {
    pageName = input.required<string>();
    pageBaseName = input<string>();
}
