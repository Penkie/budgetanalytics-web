import { Component, inject } from '@angular/core';
import Keycloak from 'keycloak-js';

@Component({
    selector: 'app-about',
    imports: [],
    templateUrl: './about.html',
    styleUrl: './about.scss',
})
export class About {
    private readonly keycloak = inject(Keycloak);

    /**
     * Start login sequence from kc
     */
    public login(): void {
        this.keycloak.login({
            redirectUri: window.location.origin + '/cockpit',
        });
    }
}
