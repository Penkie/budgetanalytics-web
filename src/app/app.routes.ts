import { Routes } from '@angular/router';
import { About } from './about/about';
import { Layout } from './layout/layout';
import { Dashboard } from './layout/pages/dashboard/dashboard';
import { canActivateAuthRole } from './common/guard/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: About,
    },
    {
        path: 'cockpit',
        component: Layout,
        canActivate: [canActivateAuthRole],
        children: [
            {
                path: '',
                component: Dashboard,
                canActivate: [canActivateAuthRole],
            },
        ],
    },
];
