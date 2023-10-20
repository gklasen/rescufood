import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IngredientsOverviewComponent } from './ingredients_overview/ingredients_overview.component';
import { IngredientDetailsComponent } from './ingredient_details/ingredient_details.component';
import { IngredientInsertionComponent } from './ingredient_insertion/ingredient_insertion.component';

const routes: Routes = [
	{
		path: '', 
		data: {
			title: 'Ingredients',
		},
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'ingredients_overview'
			},
			{
				path: 'ingredients_overview',
				component: IngredientsOverviewComponent,
				data: {
					title: 'Overview',
				},
			},
			{
				path: 'ingredient_details/:id',
				component: IngredientDetailsComponent,
				data: {
					title: 'Details',
				},
			},
			{
				path: 'ingredient_insertion',
				component: IngredientInsertionComponent,
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
export class IngredientsRoutingModule {}

