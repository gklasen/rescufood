import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OccurancesRoutingModule } from './occurances-routing.module';

import { OccurancesComponent } from './occurances.component'; 

@NgModule({
	declarations: [
		OccurancesComponent
	],
	imports: [
		CommonModule, 
		OccurancesRoutingModule
	],
	exports: [
		OccurancesComponent
	]  
})
export class OccurancesModule {}
