import { Routes } from '@angular/router';
import { About } from './about/about';
import { Layout } from './layout/layout';
import { Dashboard } from './layout/pages/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: About,
    },
    {
        path: 'cockpit',
        component: Layout,
        children: [
            {
                path: '',
                component: Dashboard,
            },
        ],
    },
];
