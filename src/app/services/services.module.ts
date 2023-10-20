import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientsService } from './ingredients.service' 
import { RecipesService } from './recipes.service' 
import { RecipeDraftsService } from './recipe_drafts.service' 
import { RecipeParserService } from './recipe_parser.service' 
import { RecipeTranslatorService } from './recipe_translator.service' 

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [],
	providers: [ 
		IngredientsService, 
		RecipesService,
		RecipeDraftsService,
		RecipeParserService,
		RecipeTranslatorService
	]
})

export class ServicesModule {
}
