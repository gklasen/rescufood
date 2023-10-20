import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientInsertionRoutingModule } from './ingredient-insertion-routing.module'; 
import { IngredientInsertionComponent } from './ingredient-insertion.component'; 


@NgModule({
	declarations: [
		IngredientInsertionComponent
	],
	imports: [
		CommonModule, 
		IngredientInsertionRoutingModule
	],
	exports: [
		IngredientInsertionComponent
	] 
})
export class IngredientInsertionModule {}
