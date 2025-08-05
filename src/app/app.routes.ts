import { Routes } from '@angular/router';
import { About } from './about/about';
import { Dashboard } from './dashboard/dashboard';
import { canActivateAuthRole } from './common/guard/auth-guard';

export const routes: Routes = [
	{
		path: '',
		component: About,
	},
	{
		path: 'dashboard',
		component: Dashboard,
		canActivate: [canActivateAuthRole],
	},
];
