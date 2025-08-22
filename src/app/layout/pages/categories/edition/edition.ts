import {
    Component,
    computed,
    effect,
    Inject,
    inject,
    signal,
} from '@angular/core';
import {
    PageHeader,
    PagePath,
} from '../../../../common/components/page-header/page-header';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    catchError,
    concat,
    delay,
    filter,
    map,
    Observable,
    of,
    startWith,
    Subject,
    switchMap,
    tap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../common/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../common/services/categorie.service';
import { Category } from '../../../../common/models/categorie.model';
import { IconsService } from '../../../../common/services/icons.service';
import { CommonModule } from '@angular/common';

interface FormState {
    loading: boolean;
    success: boolean;
    error: string | null;
    category: Category | null;
}

@Component({
    selector: 'app-edition',
    imports: [PageHeader, ReactiveFormsModule, CommonModule],
    templateUrl: './edition.html',
    styleUrl: './edition.scss',
})
export class CategoryEdition {
    private readonly categoryService = inject(CategoryService);
    private readonly submitSubject = new Subject<Category>();
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly iconsService = inject(IconsService);

    public isArchived = false;

    public readonly categoryId = toSignal(
        this.activatedRoute.paramMap.pipe(map((params) => params.get('id'))),
        { initialValue: null }
    );

    public readonly editMode = computed(() => !!this.categoryId());

    public iconList = toSignal(this.iconsService.getIconsList(), {
        initialValue: [],
    });
    public colorList = toSignal(this.iconsService.getColorList(), {
        initialValue: [],
    });

    public selectedIcon = signal('');
    public selectedColor = signal('');

    public loadCategory = toSignal(
        this.activatedRoute.paramMap.pipe(
            map((params) => params.get('id')),
            filter((id): id is string => !!id),
            switchMap((id) => {
                return this.categoryService.getCategorieById(id).pipe(
                    catchError((error) => {
                        this.notificationService.error(
                            'Error while loading selected category.'
                        );
                        return of(null);
                    })
                );
            })
        ),
        { initialValue: null }
    );

    public readonly pagePath: Array<PagePath> = [
        {
            name: 'Configuration',
            route: false,
        },
        {
            name: 'Categories',
            route: true,
            routerLink: '/cockpit/categories',
        },
        {
            name: this.categoryId() ? 'Edit category' : 'Create category',
            route: false,
            main: true,
        },
    ];

    public submitted = signal(false);

    public editForm = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.maxLength(255),
        ]),
        icon: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
        color: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
    });

    public formState = toSignal(
        this.submitSubject.pipe(
            switchMap((category: Category) =>
                concat(
                    of({
                        loading: true,
                        success: false,
                        error: null,
                        category: null,
                    }),
                    this.editMode()
                        ? this.updateCategory(category)
                        : this.createCategory(category)
                )
            ),
            startWith({
                loading: false,
                success: false,
                error: null,
                category: null,
            })
        ),
        {
            initialValue: {
                loading: false,
                success: false,
                error: null,
                category: null,
            },
        }
    );

    public createCategory(categoryData: Category): Observable<FormState> {
        return this.categoryService.createCategory(categoryData).pipe(
            tap(() => {
                this.notificationService.success(
                    'Category created successfully'
                );
                this.router.navigate(['/cockpit/categories']);
            }),
            map(
                (createdCategory): FormState => ({
                    success: true,
                    loading: false,
                    error: null,
                    category: createdCategory,
                })
            ),
            catchError((error) => {
                this.displayErrorMessage(error);
                return of({
                    loading: false,
                    success: false,
                    error: 'true',
                    category: null,
                } as FormState);
            })
        );
    }

    public updateCategory(categoryData: Category): Observable<FormState> {
        const id = this.categoryId();
        const updatedCategory = { ...categoryData, id: id as string };

        return this.categoryService.updateCategory(updatedCategory).pipe(
            tap(() => {
                this.notificationService.success('Category saved successfully');
                this.router.navigate(['/cockpit/categories']);
            }),
            map(
                (createdCategory): FormState => ({
                    success: true,
                    loading: false,
                    error: null,
                    category: createdCategory,
                })
            ),
            catchError((error) => {
                this.displayErrorMessage(error);
                return of({
                    loading: false,
                    success: false,
                    error: 'true',
                    category: null,
                } as FormState);
            })
        );
    }

    public submitForm(archive = false): void {
        this.submitted.set(true);

        if (this.editForm.status === 'INVALID') {
            return;
        }

        const category = {
            name: this.editForm.controls.name.value || '',
            icon: this.editForm.controls.icon.value || '',
            color: this.editForm.controls.color.value || '',
            archived: archive,
        };

        this.submitSubject.next(category);
    }

    constructor() {
        effect(() => {
            const category = this.loadCategory();
            if (category && this.editMode()) {
                if (category.archived) {
                    this.isArchived = true;
                }
                this.editForm.patchValue({
                    name: category.name,
                    color: category.color,
                    icon: category.icon,
                });
                this.selectedColor.set(category.color);
                this.selectedIcon.set(category.icon);
            }
        });

        effect(() => {
            const selectedColor = this.selectedColor();
            const selectedIcon = this.selectedIcon();

            this.editForm.patchValue({
                color: selectedColor,
                icon: selectedIcon,
            });
        });
    }

    private displayErrorMessage(error: HttpErrorResponse): void {
        if (error.status === 400) {
            this.notificationService.error(
                error.error?.message || 'Invalid data.'
            );
        }
        if (error.status === 500) {
            this.notificationService.error(
                error.error?.message ||
                    'Something went wrong with our servers. Please try again later or contact us.'
            );
        } else {
            this.notificationService.error(
                error.error?.message || 'Something went wrong.'
            );
        }
    }
}
