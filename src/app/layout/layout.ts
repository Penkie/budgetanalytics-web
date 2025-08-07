import { Component, computed, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, RouterModule],
    templateUrl: './layout.html',
    styleUrl: './layout.scss',
})
export class Layout {
    // Signal for mobile sidebar state
    private mobileMenuOpen = signal(false);

    // Computed property for easier template access
    isMobileSidebarOpen = computed(() => this.mobileMenuOpen());

    toggleMobileSidebar(): void {
        this.mobileMenuOpen.update((open) => !open);
    }

    closeMobileSidebar(): void {
        this.mobileMenuOpen.set(false);
    }
}
