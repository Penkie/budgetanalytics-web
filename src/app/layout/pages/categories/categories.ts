import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../../common/components/page-header/page-header';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, filter, map, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../common/services/notification.service';
import { CategoryService } from '../../../common/services/categorie.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-categories',
    imports: [PageHeader, RouterModule, FormsModule, CommonModule],
    templateUrl: './categories.html',
    styleUrl: './categories.scss',
})
export class Categories {
    private readonly categorieService = inject(CategoryService);
    private readonly allCategories = toSignal(
        this.categorieService.getCategories().pipe(
            catchError(() => {
                this.notificationService.error(
                    'Something went wrong while loading your categories.'
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

    public readonly isLoading = computed(() => this.allCategories() === null);

    public readonly displayArchived = signal(false);
    public readonly categories = computed(() => {
        const categories = this.allCategories();
        const showArchived = this.displayArchived();
        if (categories) {
            return categories.filter((categorie) =>
                showArchived ? categorie : categorie.archived != true
            );
        }
        return [];
    });

    public readonly categoriesArchivedCount = computed(() => {
        const categories = this.allCategories();
        if (categories) {
            return categories.filter((a) => a.archived).length;
        }
        return 0;
    });
}
