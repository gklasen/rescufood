import { Component  } from '@angular/core';  
import { RecipeDraftsService } from '../../../services/recipe_drafts.service';

@Component({
  selector: 'app-drafts_overview',
  templateUrl: './drafts_overview.component.html',
  styleUrls: ['./drafts_overview.component.scss']
})
export class DraftsOverviewComponent {
	
	categories: any;
	
	constructor(public recipeDraftsService: RecipeDraftsService) {}
}
