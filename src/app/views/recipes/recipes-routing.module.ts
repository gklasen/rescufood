import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipesOverviewComponent } from './recipes_overview/recipes_overview.component';
import { RecipeDetailsComponent } from './recipe_details/recipe_details.component';
import { RecipeInsertionComponent } from './recipe_insertion/recipe_insertion.component';

const routes: Routes = [
	{
		path: '', 
		data: {
			title: 'Recipes',
		},
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'recipes_overview'
			},
			{
				path: 'recipes_overview',
				component: RecipesOverviewComponent,
				data: {
					title: 'Overview',
				},
			},
			{
				path: 'recipe_details/:id',
				component: RecipeDetailsComponent,
				data: {
					title: 'Details',
				},
			},
			{
				path: 'recipe_insertion',
				component: RecipeInsertionComponent,
				data: {
					title: 'Insertion',
				},
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}

