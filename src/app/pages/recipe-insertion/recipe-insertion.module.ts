import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipeInsertionRoutingModule } from './recipe-insertion-routing.module';

import { RecipeInsertionComponent } from './recipe-insertion.component'; 

@NgModule({
	declarations: [
		RecipeInsertionComponent
	],
	imports: [
		CommonModule, 
		RecipeInsertionRoutingModule
	],
	exports: [
		RecipeInsertionComponent
	]  
})
export class RecipeInsertionModule {}
