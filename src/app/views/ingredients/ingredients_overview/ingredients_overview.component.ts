import { Component } from '@angular/core';
import { IngredientsService } from '../../../services/ingredients.service';

@Component({
  selector: 'app-ingredients_overview',
  templateUrl: './ingredients_overview.component.html',
  styleUrls: ['./ingredients_overview.component.scss']
})
export class IngredientsOverviewComponent {
	
	constructor(public ingredientsService: IngredientsService) {
		
	}
}
