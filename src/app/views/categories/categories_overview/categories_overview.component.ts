import { Component, ChangeDetectorRef } from '@angular/core';
import { IngredientsService } from '../../../services/ingredients.service'; 
import { first } from 'rxjs'

@Component({
  selector: 'app-categories_overview',
  templateUrl: './categories_overview.component.html',
  styleUrls: ['./categories_overview.component.scss']
})
export class CategoriesOverviewComponent {
	
	categories: any;
	
	constructor( 
		public ingredientsService: IngredientsService,
		public cdr: ChangeDetectorRef) { 
		this.ingredientsService.getCategories().subscribe((categories) => { 
			this.categories = categories; 
			this.cdr.detectChanges();
		});
	}
}
