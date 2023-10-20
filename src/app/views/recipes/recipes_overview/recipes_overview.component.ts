import { Component } from '@angular/core';
import { RecipesService } from '../../../services/recipes.service';

@Component({
  selector: 'app-recipes_overview',
  templateUrl: './recipes_overview.component.html',
  styleUrls: ['./recipes_overview.component.scss']
})
export class RecipesOverviewComponent {
	
	constructor(public recipesService: RecipesService) {
		
	}
}
