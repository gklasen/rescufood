import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DraftsOverviewComponent } from './drafts_overview/drafts_overview.component'; 
import { DraftDetailsComponent } from './draft_details/draft_details.component'; 
 
const routes: Routes = [
	{
		path: '', 
		data: {
			title: 'Drafts',
		},
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'drafts_overview'
			},
			{
				path: 'drafts_overview',
				component: DraftsOverviewComponent,
				data: {
					title: 'Overview',
				},
			},
			{
				path: 'draft_details/:id',
				component: DraftDetailsComponent,
				data: {
					title: 'Details',
				},
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DraftsRoutingModule {}

