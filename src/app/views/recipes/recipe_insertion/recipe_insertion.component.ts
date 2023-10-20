import { Component, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RecipesService } from '../../../services/recipes.service';
import { IngredientsService } from '../../../services/ingredients.service';
 
import { RecipeParserService } from '../../../services/recipe_parser.service'  
import { RecipeTranslatorService } from '../../../services/recipe_translator.service' 
import { Router } from '@angular/router';

import { IDGenerator } from '../../../utils/idgenerator' 

import { TranslateService } from '@ngx-translate/core';

import { dialog } from '@electron/remote';
import * as path from 'path'
import { forkJoin, Observable } from 'rxjs';
import { IconSetService } from '@coreui/icons-angular';
import { cilCaretTop, cilCaretBottom, cilPlus, cilTrash, brandSet } from '@coreui/icons';  
import { first } from 'rxjs'

@Component({
  selector: 'app-recipe_insertion',
  templateUrl: './recipe_insertion.component.html',
  styleUrls: ['./recipe_insertion.component.scss']
})
export class RecipeInsertionComponent implements AfterViewInit {
	
	@ViewChild('description_de') descriptionTextFieldDe: ElementRef;
	@ViewChild('description_en') descriptionTextFieldEn: ElementRef;
	
	selectedRecipe; 
	ingToBeChanged;
	
	alertShown: boolean = false;
	alertText: string = "";
	
	alreadySaved: boolean = false;
	
	constructor(
		public recipesService: RecipesService, 
		public ingredientsService: IngredientsService, 
		public recipeParserService: RecipeParserService,
		public recipeTranslatorService: RecipeTranslatorService,
		private router: Router,
		public translate: TranslateService,
		public iconSet: IconSetService,
		public cdr: ChangeDetectorRef
	) {
		this.iconSet.icons = { cilCaretBottom, cilCaretTop, cilPlus, cilTrash, ...brandSet }; 
		this.initRecipe(); 
	}
	
	initRecipe() {
		this.recipesService.getDummyRecipe().then((selectedRecipe) => {  
			this.selectedRecipe = selectedRecipe;   
			this.sortIngredientsOrder();
			this.addMissingIngredientsParams();
			var ingredientIds = this.selectedRecipe.ingredients.map(ing => ing.name); 
			console.log("ingredientIds", ingredientIds)
			
			this.ingredientsService.getIngredientsByMultipleIds(ingredientIds).subscribe((results) => {
				for(var ing of results) {
					var match = this.selectedRecipe.ingredients.find(i => i.name === ing.id);
					match["title"] = ing.names.de[0];
					match["icon"] = ing.icon;
				}
				console.log("results", this.selectedRecipe.ingredients)
			});
		}); 
	}
	
	ngAfterViewInit() {
		setTimeout(() => { 
			this.updateTextareaHeights(); 
			this.cdr.detectChanges(); 
		},2500);
	}
	
	sortIngredientsOrder() {
		this.selectedRecipe.ingredients.sort((ingA, ingB) => {
			if (ingA.order < ingB.order) return -1;
			if (ingA.order > ingB.order) return 1; 
			return 0;
		}); 
	}
	
	addMissingIngredientsParams() {
		for(var ingredient of this.selectedRecipe.ingredients) {
			if(!ingredient.optional) ingredient.optional = "";
			if(!ingredient.category) ingredient.category = "";
		}
	}
	
	updateTextareaHeights() {
		var deArea = (<HTMLTextAreaElement>this.descriptionTextFieldDe.nativeElement);
		var enArea = (<HTMLTextAreaElement>this.descriptionTextFieldEn.nativeElement);
		
		console.log("deArea.scrollHeight", deArea.scrollHeight, enArea.scrollHeight, enArea.scrollHeight)
		
		deArea.style.height = "1px";
		deArea.style.height = (25 + deArea.scrollHeight)+"px";
		enArea.style.height = "1px";
		enArea.style.height = (25 + enArea.scrollHeight)+"px"; 
	}

	changeURL(input_event: Event) {
		this.selectedRecipe.url = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges(); 
	}	
	
	changeTitle(input_event: Event, language: string) {
		this.selectedRecipe.title[language] = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges(); 
	}	
	
	changeDescription(input_event: Event, language: string) {
		this.selectedRecipe.description[language] = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges(); 
		
		this.updateTextareaHeights();
	}	
	
	changeDuration(input_event: Event, type: string) {
		const duration = parseFloat((input_event.target as HTMLInputElement).value);
		switch(type) {
			case "prep":
				this.selectedRecipe.duration_prep = duration;
				break;
			case "cook":
				this.selectedRecipe.duration_cook = duration;
				break;
			case "rest":
				this.selectedRecipe.duration_rest = duration;
				break;
			default: 
				break;
		}
		this.selectedRecipe.duration_total = this.selectedRecipe.duration_prep + this.selectedRecipe.duration_cook + this.selectedRecipe.duration_rest;
	}
	
	changePortions(input_event: Event) {
		this.selectedRecipe.portions = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges(); 
	}

	changeDifficulty(input_event: Event) {
		this.selectedRecipe.difficulty = parseInt((input_event.target as HTMLInputElement).value);
		this.cdr.detectChanges(); 
	}
	
	pushUpOrder(index) {
		this.selectedRecipe.ingredients[index].order--;
		this.selectedRecipe.ingredients[index-1].order++; 
		this.sortIngredientsOrder();
	}
	
	pushDownOrder(index) {
		this.selectedRecipe.ingredients[index].order++;
		this.selectedRecipe.ingredients[index+1].order--; 
		this.sortIngredientsOrder();
	}
	
	markOldIngredient(input_event: Event) { 
		this.ingToBeChanged = this.selectedRecipe.ingredients.find(i => i.name === (input_event.target as HTMLInputElement).value);
	}

	async changeIngredient(input_event: Event) {
		console.log(this.ingToBeChanged); 	
		this.ingredientsService.getIngredientById((input_event.target as HTMLInputElement).value).pipe(first()).subscribe((chosenIng) => { 
			var match = this.selectedRecipe.ingredients[this.ingToBeChanged.order-1];
			
			match.icon = chosenIng.icon;
			match.name = chosenIng.id;
			match.title = chosenIng.id;
			match.unit = chosenIng.units[0].name
			match.value = chosenIng.units[0].value
			match.category = chosenIng.category
			console.log(match, this.selectedRecipe.ingredients, chosenIng); 
			this.cdr.detectChanges(); 
		});
	}

	addIngredient()	{
		
		this.ingredientsService.getDummyIngredient().pipe(first()).subscribe((dummy) => {
			this.selectedRecipe.ingredients.push({
				order: this.selectedRecipe.ingredients.length+1,
				icon: dummy['icon'],
				name: dummy['id'],
				unit: dummy['units'][0]['name'],
				value: dummy['units'][0]['value'],
				category: dummy['category']
			})
		}); 
	}
	
	removeIngredient(ing_name: string)	{ 
		const index = this.selectedRecipe.ingredients.findIndex(i => i.name === ing_name);
		this.selectedRecipe.ingredients.splice(index, 1); 
		
		for(var newIndex = 0; newIndex < this.selectedRecipe.ingredients.length; newIndex++) {
			this.selectedRecipe.ingredients[newIndex].order = newIndex+1;
		} 
	}
	
	translateRecipe() {
		this.recipeTranslatorService.translate(this.selectedRecipe.title['de'], this.selectedRecipe.description['de']).then((translations: any) => {
			this.selectedRecipe.title['en'] = translations.title_en;
			this.selectedRecipe.description['en'] = translations.description_en;
			this.cdr.detectChanges(); 
			this.updateTextareaHeights();
		}).catch((e) => {
			console.log(e);
		});
	}
	
	parseURL() {
		this.recipesService.getRecipeURLs().pipe(first()).subscribe((urls) => {
			this.alreadySaved = urls.includes(this.selectedRecipe.url);
			
			console.log(this.alreadySaved, urls,this.selectedRecipe.url )
			
			if(!this.alreadySaved) {
				this.recipeParserService.parseRecipe(this.selectedRecipe.url).then((recipe) => {
					this.selectedRecipe = recipe;
					this.cdr.detectChanges(); 
					this.updateTextareaHeights(); 
				});
			}  
			this.cdr.detectChanges();
		});
	}
	
	updateRecipe() {
		
		var dummyValue = this.translate.instant("INGREDIENTS.ENTRY"); 
		
		console.log("before:", this.selectedRecipe)
		
		if(this.selectedRecipe.url.trim().length === 0) {
			this.alertText = this.translate.instant("RECIPES.ALERTS.URL_NEEDED");
			this.alertShown = true;
		} else if(this.selectedRecipe.title.de.trim().length === 0 || this.selectedRecipe.title.de.trim() === dummyValue ||
			this.selectedRecipe.title.en.trim().length === 0 || this.selectedRecipe.title.en.trim() === dummyValue) {
			this.alertText = this.translate.instant("RECIPES.ALERTS.MISSING_TITLES");
			this.alertShown = true;
		} else if(Number.isNaN(this.selectedRecipe.duration_total) || this.selectedRecipe.duration_total == 0 ) {
			this.alertText = this.translate.instant("RECIPES.ALERTS.MISSING_DURATION");
			this.alertShown = true;
		} else if(this.selectedRecipe.portions == 0) {
			this.alertText = this.translate.instant("RECIPES.ALERTS.MISSING_PORTIONS");
			this.alertShown = true;
		} else if(this.selectedRecipe.description.de.trim().length === 0 || this.selectedRecipe.description.de.trim() === dummyValue ||
			this.selectedRecipe.description.en.trim().length === 0 || this.selectedRecipe.description.en.trim() === dummyValue) {
			this.alertText = this.translate.instant("RECIPES.ALERTS.MISSING_DESCRIPTIONS");
			this.alertShown = true;
		} else if(this.selectedRecipe.ingredients.find(ingredient => ingredient.name === "dummy")) {
			this.alertText = this.translate.instant("RECIPES.ALERTS.DUMMY_INGREDIENT");
			this.alertShown = true;
		} else if(this.selectedRecipe.ingredients.find(ingredient => Number.isNaN(ingredient.value) || ingredient.value === null)) {
			this.alertText = this.translate.instant("RECIPES.ALERTS.FALSE_INGREDIENT_VALUE");
			this.alertShown = true;
		} else if(this.selectedRecipe.ingredients.find(ingredient => ingredient.unit !== "some" && ingredient.value == 0)) {
			this.alertText = this.translate.instant("RECIPES.ALERTS.EMPTY_INGREDIENT");
			this.alertShown = true;
		}
		
		this.cdr.detectChanges();
		
		if(!this.alertShown) { 
			if(!this.selectedRecipe.author) delete this.selectedRecipe.author;
			if(!this.selectedRecipe.author_mail) delete this.selectedRecipe.author_mail;
			if(!this.selectedRecipe.duration_prep) delete this.selectedRecipe.duration_prep;
			if(!this.selectedRecipe.duration_cook) delete this.selectedRecipe.duration_cook;
			if(!this.selectedRecipe.duration_rest) delete this.selectedRecipe.duration_rest; 
			if(!this.selectedRecipe.vegan) delete this.selectedRecipe.vegan;
			if(!this.selectedRecipe.vegetarian) delete this.selectedRecipe.vegetarian;
			delete this.selectedRecipe.icon;
			
			for(var ingredient of this.selectedRecipe.ingredients) {
				if(!ingredient.optional) delete ingredient.optional;
				if(!ingredient.category) delete ingredient.category;
				delete ingredient.title;
				delete ingredient.icon;
			}
			 
			this.recipesService.addRecipe(this.selectedRecipe).then(() => {
				this.router.navigate(["/recipes/recipes_overview"]);
			}).catch((e) => {
				console.log(e);
			}); 
			
			
		} else {
			setTimeout(() => {
				this.alertShown = false;
				this.cdr.detectChanges();
			}, 2000); 
		}
		
		
		console.log(this.selectedRecipe)
	}
}
