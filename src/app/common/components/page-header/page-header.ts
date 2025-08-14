import { Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface PagePath {
    name: string;
    route?: boolean;
    routerLink?: string;
    main?: boolean;
}

@Component({
    selector: 'page-header',
    imports: [RouterModule],
    templateUrl: './page-header.html',
    styleUrl: './page-header.scss',
})
export class PageHeader {
    public pageName = input<string>();
    public pageBaseName = input<string>();
    public pagePath = input<Array<PagePath>>();
    public readonly pagePathLength = computed(
        () => this.pagePath()?.length ?? 0
    );
}
