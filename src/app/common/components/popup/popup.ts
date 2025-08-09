import {
    Component,
    input,
    output,
    signal,
    computed,
    ChangeDetectionStrategy,
    HostListener,
    effect,
    inject,
    ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-popup',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    template: `
        @if (isOpen()) {
        <div class="popup-overlay" (click)="onOverlayClick($event)">
            <div
                class="popup-container"
                [class.fullscreen]="isMobile()"
                (click)="$event.stopPropagation()"
            >
                <!-- Header -->
                <div class="popup-header">
                    <h2 class="popup-title">{{ title() }}</h2>
                    <button
                        class="close-btn"
                        (click)="closePopup()"
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" class="close-icon">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Content -->
                <div class="popup-content">
                    <ng-content></ng-content>
                </div>

                <!-- Footer (optionnel) -->
                @if (showFooter()) {
                <div class="popup-footer">
                    <ng-content select="[slot=footer]"></ng-content>
                </div>
                }
            </div>
        </div>
        }
    `,
    styles: [
        `
            .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            }

            .popup-container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                    0 10px 10px -5px rgba(0, 0, 0, 0.04);
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transform: translateY(0);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .popup-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid #e5e7eb;
                flex-shrink: 0;
            }

            .popup-title {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #111827;
            }

            .close-btn {
                background: none;
                border: none;
                padding: 8px;
                cursor: pointer;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s ease;

                &:hover {
                    background: #f3f4f6;
                }

                &:active {
                    background: #e5e7eb;
                }
            }

            .close-icon {
                width: 20px;
                height: 20px;
                fill: #6b7280;
            }

            .popup-content {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
            }

            .popup-footer {
                padding: 16px 24px;
                border-top: 1px solid #e5e7eb;
                background: #f9fafb;
                flex-shrink: 0;
            }

            /* Animations */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .popup-overlay {
                animation: fadeIn 0.3s ease;
            }

            .popup-container {
                animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Mobile - Fullscreen */
            @media (max-width: 768px) {
                .popup-overlay {
                    padding: 0;
                    align-items: flex-start;
                }

                .popup-container.fullscreen {
                    max-width: none;
                    max-height: none;
                    height: 100vh;
                    border-radius: 0;
                    margin: 0;
                    animation: slideInMobile 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .popup-header {
                    padding: 16px 20px;
                    background: #f9fafb;
                }

                .popup-content {
                    padding: 20px;
                }

                .popup-footer {
                    padding: 16px 20px;
                }
            }

            @keyframes slideInMobile {
                from {
                    opacity: 0;
                    transform: translateY(100%);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Très petit écran */
            @media (max-width: 480px) {
                .popup-header {
                    padding: 12px 16px;
                }

                .popup-title {
                    font-size: 16px;
                }

                .popup-content {
                    padding: 16px;
                }

                .popup-footer {
                    padding: 12px 16px;
                }
            }
        `,
    ],
    animations: [],
})
export class PopupComponent {
    // Inputs
    isOpen = input<boolean>(false);
    title = input<string>();
    showFooter = input<boolean>(false);
    closeOnOverlayClick = input<boolean>(true);

    // Outputs
    closeEvent = output<void>();

    // Internal state
    private windowWidth = signal(window.innerWidth);

    // Computed
    isMobile = computed(() => this.windowWidth() <= 768);

    constructor() {
        // Effect pour gérer le scroll du body
        effect(() => {
            if (this.isOpen()) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(event: any): void {
        this.windowWidth.set(event.target.innerWidth);
    }

    onOverlayClick(event: MouseEvent): void {
        if (
            this.closeOnOverlayClick() &&
            event.target === event.currentTarget
        ) {
            this.closePopup();
        }
    }

    closePopup(): void {
        this.closeEvent.emit();
    }
}
