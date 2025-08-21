import { Component, computed, effect, inject, signal } from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterModule,
    RouterOutlet,
} from '@angular/router';
import { NotificationContainerComponent } from '../common/components/notification/notification';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, RouterModule, NotificationContainerComponent],
    templateUrl: './layout.html',
    styleUrl: './layout.scss',
})
export class Layout {
    // Signal for mobile sidebar state
    private mobileMenuOpen = signal(false);

    // Computed property for easier template access
    isMobileSidebarOpen = computed(() => this.mobileMenuOpen());

    private readonly router = inject(Router);

    constructor() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                if (this.mobileMenuOpen()) {
                    this.closeMobileSidebar();
                }
            });
    }

    toggleMobileSidebar(): void {
        this.mobileMenuOpen.update((open) => !open);
    }

    closeMobileSidebar(): void {
        this.mobileMenuOpen.set(false);
    }
}
