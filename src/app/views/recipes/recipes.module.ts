import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListGroupModule } from '@coreui/angular'; 
import { FormsModule } from '@angular/forms';

import { RecipesOverviewComponent } from './recipes_overview/recipes_overview.component';
import { RecipeDetailsComponent } from './recipe_details/recipe_details.component';
import { RecipeInsertionComponent } from './recipe_insertion/recipe_insertion.component'; 

import { RecipesRoutingModule } from './recipes-routing.module';
import { DocsComponentsModule } from '@docs-components/docs-components.module';

import { ServicesModule } from '../../services/services.module';
import { PipesModule } from '../../pipes/pipes.module';

import { TranslateModule } from '@ngx-translate/core';

import { CardModule, BadgeModule, FormModule, ImgModule, TableModule, UtilitiesModule, ButtonModule, AlertModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';

@NgModule({
	declarations: [
		RecipesOverviewComponent, 
		RecipeDetailsComponent,
		RecipeInsertionComponent
	],
	imports: [
		FormsModule,
		CommonModule,
		PipesModule,
		ServicesModule,
		RecipesRoutingModule, 
		ListGroupModule,
		DocsComponentsModule,
		TranslateModule,
		CardModule,
		BadgeModule, 
		FormModule,
		ImgModule,
		ImgModule, 
		TableModule,
		ButtonModule,
		IconModule,
		AlertModule
	],
	providers: [
		IconSetService
	]
})
export class RecipesModule {
}
