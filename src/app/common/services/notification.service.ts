import { Injectable, signal, computed } from '@angular/core';

export interface NotificationButton {
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary';
}

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'error' | 'warning';
    title?: string;
    message: string;
    buttons?: NotificationButton[];
    autoClose?: boolean;
    duration?: number; // en millisecondes
    timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private notifications = signal<Notification[]>([]);
    private idCounter = 0;

    // Signal public en lecture seule
    readonly activeNotifications = computed(() => this.notifications());

    /**
     * Affiche une notification d'information
     */
    info(
        message: string,
        options?: Partial<
            Pick<Notification, 'title' | 'buttons' | 'autoClose' | 'duration'>
        >
    ) {
        return this.addNotification({
            type: 'info',
            message,
            autoClose: true,
            duration: 5000,
            ...options,
        });
    }

    /**
     * Affiche une notification de succès
     */
    success(
        message: string,
        options?: Partial<
            Pick<Notification, 'title' | 'buttons' | 'autoClose' | 'duration'>
        >
    ) {
        return this.addNotification({
            type: 'success',
            message,
            autoClose: true,
            duration: 4000,
            ...options,
        });
    }

    /**
     * Affiche une notification d'erreur
     */
    error(
        message: string,
        options?: Partial<
            Pick<Notification, 'title' | 'buttons' | 'autoClose' | 'duration'>
        >
    ) {
        return this.addNotification({
            type: 'error',
            message,
            autoClose: false, // Erreurs ne se ferment pas automatiquement
            ...options,
        });
    }

    /**
     * Affiche une notification d'avertissement
     */
    warning(
        message: string,
        options?: Partial<
            Pick<Notification, 'title' | 'buttons' | 'autoClose' | 'duration'>
        >
    ) {
        return this.addNotification({
            type: 'warning',
            message,
            autoClose: false, // Warnings ne se ferment pas automatiquement
            ...options,
        });
    }

    /**
     * Ajoute une notification personnalisée
     */
    addNotification(
        notification: Omit<Notification, 'id' | 'timestamp'>
    ): string {
        const id = this.generateId();
        const newNotification: Notification = {
            id,
            timestamp: Date.now(),
            ...notification,
        };

        this.notifications.update((current) => [...current, newNotification]);

        // Auto-close si demandé
        if (newNotification.autoClose) {
            setTimeout(() => {
                this.remove(id);
            }, newNotification.duration || 5000);
        }

        return id;
    }

    /**
     * Supprime une notification par son ID
     */
    remove(id: string): void {
        this.notifications.update((current) =>
            current.filter((notification) => notification.id !== id)
        );
    }

    /**
     * Supprime toutes les notifications
     */
    clear(): void {
        this.notifications.set([]);
    }

    /**
     * Supprime les notifications d'un type spécifique
     */
    clearByType(type: Notification['type']): void {
        this.notifications.update((current) =>
            current.filter((notification) => notification.type !== type)
        );
    }

    private generateId(): string {
        return `notification-${++this.idCounter}-${Date.now()}`;
    }
}
