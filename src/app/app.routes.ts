import { Routes } from '@angular/router';
import { About } from './about/about';
import { Layout } from './layout/layout';
import { Dashboard } from './layout/pages/dashboard/dashboard';
import { canActivateAuthRole } from './common/guard/auth-guard';
import { Accounts } from './layout/pages/accounts/accounts';
import { AccountEdition } from './layout/pages/accounts/edition/edition';
import { Categories } from './layout/pages/categories/categories';
import { CategoryEdition } from './layout/pages/categories/edition/edition';

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
            {
                path: 'accounts',
                component: Accounts,
                canActivate: [canActivateAuthRole],
            },
            {
                path: 'accounts/edition',
                component: AccountEdition,
                canActivate: [canActivateAuthRole],
            },
            {
                path: 'accounts/edition/:id',
                component: AccountEdition,
                canActivate: [canActivateAuthRole],
            },
            {
                path: 'categories',
                component: Categories,
                canActivate: [canActivateAuthRole],
            },
            {
                path: 'categories/edition',
                component: CategoryEdition,
                canActivate: [canActivateAuthRole],
            },
            {
                path: 'categories/edition/:id',
                component: CategoryEdition,
                canActivate: [canActivateAuthRole],
            },
        ],
    },
];
