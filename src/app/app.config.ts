import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
    AutoRefreshTokenService,
    createInterceptorCondition,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    IncludeBearerTokenCondition,
    includeBearerTokenInterceptor,
    provideKeycloak,
    UserActivityService,
    withAutoRefreshToken,
} from 'keycloak-angular';
import { environment } from '../environments/environment.development';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

const pathCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: environment.api_url_pattern,
});

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
                redirectUri: environment.path + '/cockpit',
            },
            features: [
                // withAutoRefreshToken({
                //     onInactivityTimeout: 'logout',
                //     sessionTimeout: 1000,
                // }),
            ],
            providers: [
                AutoRefreshTokenService,
                UserActivityService,
                {
                    provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
                    useValue: [pathCondition],
                },
            ],
        }),
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
        provideAnimations(),
    ],
};
