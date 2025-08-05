import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideKeycloak } from 'keycloak-angular';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
    providers: [
        provideKeycloak({
            config: {
                url: environment.kc_url,
                realm: environment.kc_realm,
                clientId: environment.kc_client,
            },
            initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri:
                    window.location.origin + '/silent-check-sso.html',
            },
        }),
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
    ],
};
