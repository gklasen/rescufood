import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { RegisterComponent } from './views/pages/register/register.component';

import { AuthGuard } from './auth/auth.guard'; // Import the AuthGuard

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ingredient_insertion',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
          import('./views/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
		title: 'Home'
    },
    children: [
<<<<<<< HEAD
		{
			path: '',
			pathMatch: 'full',
			redirectTo: 'ingredients'
		},
		{
			path: 'dashboard',
			loadChildren: () =>
				import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
		},
		{
			path: 'ingredients',
			loadChildren: () =>
				import('./views/ingredients/ingredients.module').then((m) => m.IngredientsModule)
		}, 
		{
			path: 'recipes',
			loadChildren: () =>
				import('./views/recipes/recipes.module').then((m) => m.RecipesModule)
		},
		{
			path: 'categories',
			loadChildren: () =>
				import('./views/categories/categories.module').then((m) => m.CategoriesModule)
		},
		{
			path: 'drafts',
			loadChildren: () =>
				import('./views/drafts/drafts.module').then((m) => m.DraftsModule)
		},		
		{
		path: 'theme',
			loadChildren: () =>
				import('./views/theme/theme.module').then((m) => m.ThemeModule)
		},
		{
			path: 'base',
			loadChildren: () =>
				import('./views/base/base.module').then((m) => m.BaseModule)
		},
		{
			path: 'buttons',
			loadChildren: () =>
				import('./views/buttons/buttons.module').then((m) => m.ButtonsModule)
		},
		{
			path: 'forms',
			loadChildren: () =>
				import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule)
		},
		{
			path: 'charts',
			loadChildren: () =>
				import('./views/charts/charts.module').then((m) => m.ChartsModule)
		},
		{
			path: 'icons',
			loadChildren: () =>
				import('./views/icons/icons.module').then((m) => m.IconsModule)
		},
		{
			path: 'notifications',
			loadChildren: () =>
				import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
		},
		{
			path: 'widgets',
			loadChildren: () =>
				import('./views/widgets/widgets.module').then((m) => m.WidgetsModule)
		},
		{
			path: 'pages',
			loadChildren: () =>
				import('./views/pages/pages.module').then((m) => m.PagesModule)
		}		
=======
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
          canActivate: [AuthGuard], 
      },
      {
        path: 'courses',
        loadChildren: () =>
          import('./views/courses/courses.module').then((m) => m.CoursesModule),
          canActivate: [AuthGuard], 
      },
      {
        path: 'performances',
        loadChildren: () =>
          import('./views/performances/performances.module').then((m) => m.PerformancesModule),
          canActivate: [AuthGuard], 
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule)
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule)
          
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule)
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule)
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule)
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      }
>>>>>>> 5a60097796d352e7af3ff3278226200c5c8782ce
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
