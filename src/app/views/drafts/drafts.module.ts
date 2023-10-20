import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListGroupModule } from '@coreui/angular'; 
import { FormsModule } from '@angular/forms';

import { DraftsOverviewComponent } from './drafts_overview/drafts_overview.component'; 
import { DraftDetailsComponent } from './draft_details/draft_details.component';

import { DraftsRoutingModule } from './drafts-routing.module';
import { DocsComponentsModule } from '@docs-components/docs-components.module';

import { ServicesModule } from '../../services/services.module';
import { PipesModule } from '../../pipes/pipes.module';

import { TranslateModule } from '@ngx-translate/core'; 
import { CardModule, AccordionModule, SharedModule, BadgeModule, FormModule, ImgModule, TableModule, UtilitiesModule, ButtonModule, AlertModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';

@NgModule({
	declarations: [
		DraftsOverviewComponent,
		DraftDetailsComponent
	],
	imports: [
		FormsModule,
		CommonModule,
		AccordionModule,
		SharedModule,
		PipesModule,
		ServicesModule,
		DraftsRoutingModule, 
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
export class DraftsModule {
}
