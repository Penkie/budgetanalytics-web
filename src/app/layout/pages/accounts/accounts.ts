import { Component, signal } from '@angular/core';
import { PageHeader } from '../../../common/components/page-header/page-header';
import { PopupComponent } from '../../../common/components/popup/popup';

@Component({
    selector: 'app-accounts',
    imports: [PageHeader, PopupComponent],
    templateUrl: './accounts.html',
    styleUrl: './accounts.scss',
})
export class Accounts {
    public showPopup = signal(false);
    public popupText = 'Add account';

    public openPopup(): void {
        this.showPopup.set(true);
    }

    public onClosePopup(): void {
        this.showPopup.set(false);
    }

    public onSave(): void {
        // Logique de sauvegarde
        this.showPopup.set(false);
    }
}
