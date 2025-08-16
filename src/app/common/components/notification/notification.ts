import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    Notification,
    NotificationButton,
    NotificationService,
} from '../../services/notification.service';

@Component({
    selector: 'app-notification-container',
    imports: [CommonModule],
    template: `
        <div class="notification-container">
            @for (notification of notifications(); track notification.id) {
            <div [class]="getNotificationClasses(notification)">
                <!-- Icône -->
                <div class="notification-icon">
                    @switch (notification.type) { @case ('info') {
                    <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                        />
                    </svg>
                    } @case ('success') {
                    <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                        />
                    </svg>
                    } @case ('error') {
                    <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        />
                    </svg>
                    } @case ('warning') {
                    <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                        />
                    </svg>
                    } }
                </div>

                <!-- Contenu -->
                <div class="notification-content">
                    @if (notification.title) {
                    <div class="notification-title">
                        {{ notification.title }}
                    </div>
                    }
                    <div class="notification-message">
                        {{ notification.message }}
                    </div>
                </div>

                <!-- Boutons -->
                @if (notification.buttons && notification.buttons.length > 0) {
                <div class="notification-buttons">
                    @for (button of notification.buttons; track button.label) {
                    <button
                        type="button"
                        [class]="getButtonClass(button, notification.type)"
                        (click)="handleButtonClick(button, notification.id)"
                    >
                        {{ button.label }}
                    </button>
                    }
                </div>
                }

                <!-- Bouton fermer -->
                <button
                    type="button"
                    class="notification-close"
                    (click)="closeNotification(notification.id)"
                    aria-label="Close notification"
                >
                    <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        />
                    </svg>
                </button>
            </div>
            }
        </div>
    `,
    styles: [
        `
            .notification-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
                min-width: 400px;
            }

            @media (max-width: 640px) {
                .notification-container {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }

            .notification {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 16px;
                border-radius: 8px;
                background: white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-left: 4px solid;
                position: relative;
                pointer-events: auto;
                max-width: 100%;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .notification-icon {
                flex-shrink: 0;
                width: 20px;
                height: 20px;
                margin-top: 2px;
            }

            .notification-content {
                flex: 1;
                min-width: 0;
                margin-right: 8px;
            }

            .notification-title {
                font-weight: 600;
                margin-bottom: 4px;
                line-height: 1.4;
                font-size: 14px;
            }

            .notification-message {
                line-height: 1.5;
                font-size: 14px;
                color: #6b7280;
            }

            .notification-buttons {
                display: flex;
                gap: 8px;
                margin-top: 8px;
                flex-wrap: wrap;
            }

            .notification-button {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
                border: 1px solid;
                cursor: pointer;
                transition: all 0.2s ease;
                background: transparent;
            }

            .notification-button:hover {
                transform: translateY(-1px);
            }

            .notification-close {
                position: absolute;
                right: 12px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                color: #9ca3af;
                transition: all 0.2s ease;
            }

            .notification-close:hover {
                background: rgba(0, 0, 0, 0.05);
                color: #6b7280;
            }

            /* Styles par type */
            .notification--info {
                border-left-color: #3b82f6;
                color: #1e40af;
            }

            .notification--info .notification-message {
                color: #3730a3;
            }

            .notification--success {
                border-left-color: #22c55e;
                color: #166534;
            }

            .notification--success .notification-message {
                color: #15803d;
            }

            .notification--error {
                border-left-color: #ef4444;
                color: #dc2626;
            }

            .notification--error .notification-message {
                color: #b91c1c;
            }

            .notification--warning {
                border-left-color: #f59e0b;
                color: #d97706;
            }

            .notification--warning .notification-message {
                color: #b45309;
            }

            /* Styles des boutons par type */
            .button--primary-info {
                background-color: #3b82f6;
                border-color: #3b82f6;
                color: white;
            }
            .button--primary-info:hover {
                background-color: #2563eb;
            }
            .button--secondary-info {
                border-color: #3b82f6;
                color: #3b82f6;
            }
            .button--secondary-info:hover {
                background-color: #eff6ff;
            }

            .button--primary-success {
                background-color: #22c55e;
                border-color: #22c55e;
                color: white;
            }
            .button--primary-success:hover {
                background-color: #16a34a;
            }
            .button--secondary-success {
                border-color: #22c55e;
                color: #22c55e;
            }
            .button--secondary-success:hover {
                background-color: #f0fdf4;
            }

            .button--primary-error {
                background-color: #ef4444;
                border-color: #ef4444;
                color: white;
            }
            .button--primary-error:hover {
                background-color: #dc2626;
            }
            .button--secondary-error {
                border-color: #ef4444;
                color: #ef4444;
            }
            .button--secondary-error:hover {
                background-color: #fef2f2;
            }

            .button--primary-warning {
                background-color: #f59e0b;
                border-color: #f59e0b;
                color: white;
            }
            .button--primary-warning:hover {
                background-color: #d97706;
            }
            .button--secondary-warning {
                border-color: #f59e0b;
                color: #f59e0b;
            }
            .button--secondary-warning:hover {
                background-color: #fffbeb;
            }
        `,
    ],
})
export class NotificationContainerComponent {
    private notificationService = inject(NotificationService);

    // Signal computed pour les notifications actives
    notifications = computed(() =>
        this.notificationService.activeNotifications()
    );

    getNotificationClasses(notification: Notification): string {
        return `notification notification--${notification.type}`;
    }

    getButtonClass(
        button: NotificationButton,
        type: Notification['type']
    ): string {
        const variant = button.variant || 'primary';
        return `notification-button button--${variant}-${type}`;
    }

    handleButtonClick(
        button: NotificationButton,
        notificationId: string
    ): void {
        button.action();
        // Optionnellement fermer la notification après l'action
        this.notificationService.remove(notificationId);
    }

    closeNotification(id: string): void {
        this.notificationService.remove(id);
    }
}
