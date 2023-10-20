import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipeDraftsRoutingModule } from './recipe-drafts-routing.module';

import { RecipeDraftsComponent } from './recipe-drafts.component'; 

@NgModule({
	declarations: [
		RecipeDraftsComponent
	],
	imports: [
		CommonModule, 
		RecipeDraftsRoutingModule
	],
	exports: [
		RecipeDraftsComponent
	]  
})
export class RecipeDraftsModule {}
