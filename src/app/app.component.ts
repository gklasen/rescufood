import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';

import { RecipesService } from './services/recipes.service';
import { IngredientsService } from './services/ingredients.service';


import { Title } from '@angular/platform-browser';
import { Notification } from '@electron/remote'; 
import * as path from 'path';
import { first, combineLatest, map} from 'rxjs'

@Component({
	selector: 'app-root',
	template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
	title = 'Rescufood Manager';

	constructor(
		private router: Router,
		private titleService: Title,
		private iconSetService: IconSetService,
		private translate: TranslateService,
		private recipesService: RecipesService,
		private ingredientsService: IngredientsService
	) {
		
		titleService.setTitle(this.title);
		
		
		
		combineLatest([
			this.recipesService.getRecipes(),
			this.ingredientsService.getIngredients()
		]).pipe(first()).subscribe(([r, i]) => {   
			new Notification({
				title: translate.instant("NOTIFICATION.OVERVIEW"),
				body: translate.instant("NOTIFICATION.SUMMARY", {recipes: r.length, ingredients: i.length}),
				icon: path.join(__dirname, 'assets', 'icon.png')
			}).show()   
		});
		// iconSet singleton
		iconSetService.icons = { ...iconSubset };  
	
	}

	ngOnInit(): void {
		this.translate.setDefaultLang('de');
		this.translate.use('de')
		
		this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
	});
  }
}
