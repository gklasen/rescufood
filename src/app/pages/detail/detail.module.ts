import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DetailRoutingModule } from './detail-routing.module';

import { DetailComponent } from './detail.component'; 

@NgModule({
	declarations: [
		DetailComponent
	],
	imports: [
		CommonModule, 
		TranslateModule,
		DetailRoutingModule
	],
	exports: [
		DetailComponent
	]
})
export class DetailModule {}
