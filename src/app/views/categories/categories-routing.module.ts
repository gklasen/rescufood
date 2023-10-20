import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesOverviewComponent } from './categories_overview/categories_overview.component'; 

const routes: Routes = [
	{
		path: '', 
		data: {
			title: 'Categories',
		},
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'categories_overview'
			},
			{
				path: 'categories_overview',
				component: CategoriesOverviewComponent,
				data: {
					title: 'Overview',
				},
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}

