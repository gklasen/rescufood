import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListGroupModule } from '@coreui/angular'; 
import { FormsModule } from '@angular/forms';

import { IngredientsOverviewComponent } from './ingredients_overview/ingredients_overview.component';
import { IngredientDetailsComponent } from './ingredient_details/ingredient_details.component';
import { IngredientInsertionComponent } from './ingredient_insertion/ingredient_insertion.component';

import { IngredientsRoutingModule } from './ingredients-routing.module';
import { DocsComponentsModule } from '@docs-components/docs-components.module';

import { ServicesModule } from '../../services/services.module';
import { PipesModule } from '../../pipes/pipes.module';

import { TranslateModule } from '@ngx-translate/core';

import { CardModule, BadgeModule, FormModule, ImgModule, TableModule, UtilitiesModule, ButtonModule, AlertModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';

@NgModule({
	declarations: [
		IngredientsOverviewComponent, 
		IngredientDetailsComponent,
		IngredientInsertionComponent
	],
	imports: [
		FormsModule,
		CommonModule,
		PipesModule,
		ServicesModule,
		IngredientsRoutingModule, 
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
export class IngredientsModule {
}
