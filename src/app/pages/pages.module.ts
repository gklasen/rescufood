import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DetailComponent } from './detail/detail.component'; 
import { IngredientInsertionComponent } from './ingredient-insertion/ingredient-insertion.component';  
import { OccurancesComponent } from './occurances/occurances.component';  
import { RecipeDraftsComponent } from './recipe-drafts/recipe-drafts.component';  
import { RecipeInsertionComponent } from './recipe-insertion/recipe-insertion.component';    

import { DetailModule } from './detail/detail.module'; 
import { IngredientInsertionModule } from './ingredient-insertion/ingredient-insertion.module';  
import { OccurancesModule } from './occurances/occurances.module';  
import { RecipeDraftsModule } from './recipe-drafts/recipe-drafts.module';  
import { RecipeInsertionModule } from './recipe-insertion/recipe-insertion.module';    

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		DetailModule,
		IngredientInsertionModule,
		OccurancesModule,
		RecipeDraftsModule,
		RecipeInsertionModule
	], 
	exports: [
		DetailModule,
		IngredientInsertionModule,
		OccurancesModule,
		RecipeDraftsModule,
		RecipeInsertionModule
	]
})
export class PagesModule { } 