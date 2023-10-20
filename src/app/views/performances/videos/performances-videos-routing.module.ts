import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PerformancesOverviewComponent } from './performances-overview/performances-overview.component';  
import { PerformancesVideoDetailComponent } from './performances-video-detail/performances-video-detail.component';  

const routes: Routes = [
 
	{ 
		path: '', 
		children: [
			{
				path: '', 
				component: PerformancesOverviewComponent,
				data: {
					title: `Overview`
				} 
			},
			{
				path: 'performances-video-detail/:id', 
				component: PerformancesVideoDetailComponent,
				data: {
					title: `Video Detail` 
				}, 
			}
		]
	}    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformancesVideosRoutingModule {
}
