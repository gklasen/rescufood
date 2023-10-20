import { NgModule } from '@angular/core';
import { ShortDatePipe } from './short-date.pipe';

import { IngredientSortPipe } from './ingredient-sort.pipe';
import { RecipeSortPipe } from './recipe-sort.pipe'; 

@NgModule({
  declarations: [
    ShortDatePipe,
	IngredientSortPipe,
	RecipeSortPipe 
  ],
  exports: [   
    ShortDatePipe,
	IngredientSortPipe,
	RecipeSortPipe 
  ],
  
})
export class PipesModule {
}
