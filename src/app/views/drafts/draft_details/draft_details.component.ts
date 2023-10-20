import { Component, ChangeDetectorRef } from '@angular/core';  
import { RecipeDraftsService } from '../../../services/recipe_drafts.service';
import { Router } from '@angular/router';
import { IngredientsService } from '../../../services/ingredients.service';
import { first } from 'rxjs'

import { IconSetService } from '@coreui/icons-angular';
import { cilCaretTop, cilCaretBottom, cilPlus, cilTrash, brandSet } from '@coreui/icons';  

@Component({
  selector: 'app-draft_details',
  templateUrl: './draft_details.component.html',
  styleUrls: ['./draft_details.component.scss']
})
export class DraftDetailsComponent { 

	chosenId; 
	selectedDraft;
	selectedInsertedTitle;
	ingToBeChanged;
	
	constructor(
		private router: Router,
		public recipeDraftsService: RecipeDraftsService,
		public ingredientsService: IngredientsService,
		public iconSet: IconSetService,
		public cdr: ChangeDetectorRef
	) {
		this.iconSet.icons = { cilCaretBottom, cilCaretTop, cilPlus, cilTrash, ...brandSet };
		this.chosenId = this.router.url.split('/').pop().replace(/%20/g, " "); 
		this.recipeDraftsService.getRecipeDraftById(this.chosenId).subscribe((selectedDraft) => {
			console.log("selectedDraft", selectedDraft, this.chosenId );
			this.selectedDraft = selectedDraft;
			this.selectedInsertedTitle = this.selectedDraft.title[Object.keys(selectedDraft.title)[0]];
			var idsFromDraft = this.selectedDraft.ingredients.map(ing => ing.name.toLowerCase()); 
			console.log("idsFromDraft", idsFromDraft);
			this.ingredientsService.getIngredientsByMultipleIds(idsFromDraft).pipe(first()).subscribe((realIngredients) => { 
				for(var draftIngredient of this.selectedDraft.ingredients) {
					if(draftIngredient.own_ingredient) {
						draftIngredient.originalName = draftIngredient.name;
						draftIngredient.icon = "dummy";
						draftIngredient.name = "dummy"; 
					}
				} 
				for(var realIngredient of realIngredients) {
					var matchedIngredient = this.selectedDraft.ingredients.find((draftIngredient) => {
						return realIngredient.id = draftIngredient.name.toLowerCase();
					}); 
					matchedIngredient.icon = realIngredient.icon;
					matchedIngredient.name = matchedIngredient.name.toLowerCase();
					console.log("selectedDraft + ings",  this.selectedDraft, matchedIngredient);
				}   
			});
			
		});
	} 
	
	changeTitle(input_event: Event, language: string) {
		this.selectedDraft.title[language] = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges(); 
	}	
	
	changeDuration(input_event: Event, type: string) {
		const duration = parseFloat((input_event.target as HTMLInputElement).value);
		switch(type) {
			case "prep":
				this.selectedDraft.duration_prep = duration;
				break;
			case "cook":
				this.selectedDraft.duration_cook = duration;
				break;
			case "rest":
				this.selectedDraft.duration_rest = duration;
				break;
			default: 
				break;
		}
		this.selectedDraft.duration_total = this.selectedDraft.duration_prep + this.selectedDraft.duration_cook + this.selectedDraft.duration_rest;
	}
	
	changePortions(input_event: Event) {
		this.selectedDraft.portions = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges(); 
	}
	
	changeDescription(input_event: Event, language: string) {
		this.selectedDraft.description[language] = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges(); 
		
		this.updateTextareaHeights(language);
	}	
	
	updateTextareaHeights(language: string) {
		var textarea_elem = document.getElementById("description_"+language);
		
		textarea_elem.style.height = "0px";
		textarea_elem.style.height = (textarea_elem.scrollHeight) + 10 + "px";
	}
	
	addIngredient()	{
		
		this.ingredientsService.getDummyIngredient().pipe(first()).subscribe((dummy) => {
			this.selectedDraft.ingredients.push({
				order: this.selectedDraft.ingredients.length+1,
				icon: dummy['icon'],
				name: dummy['id'],
				unit: dummy['units'][0]['name'],
				value: dummy['units'][0]['value'],
				category: dummy['category']
			})
		}); 
	}
	
	removeIngredient(ing_name: string)	{ 
		const index = this.selectedDraft.ingredients.findIndex(i => i.name === ing_name);
		this.selectedDraft.ingredients.splice(index, 1); 
		
		for(var newIndex = 0; newIndex < this.selectedDraft.ingredients.length; newIndex++) {
			this.selectedDraft.ingredients[newIndex].order = newIndex+1;
		} 
	}
	
	async changeIngredient(input_event: Event) {
		console.log(this.ingToBeChanged); 	
		this.ingredientsService.getIngredientById((input_event.target as HTMLInputElement).value).pipe(first()).subscribe((chosenIng) => { 
			var match = this.selectedDraft.ingredients[this.ingToBeChanged.order-1];
			
			match.icon = chosenIng.icon;
			match.name = chosenIng.id;
			match.title = chosenIng.id;
			match.unit = chosenIng.units[0].name
			match.value = chosenIng.units[0].value
			match.category = chosenIng.category
			console.log(match, this.selectedDraft.ingredients, chosenIng); 
			this.cdr.detectChanges(); 
		});
	}

	markOldIngredient(input_event: Event) { 
		this.ingToBeChanged = this.selectedDraft.ingredients.find(i => i.name === (input_event.target as HTMLInputElement).value);
	}
	
	pushUpOrder(index) {
		this.selectedDraft.ingredients[index].order--;
		this.selectedDraft.ingredients[index-1].order++; 
		this.sortIngredientsOrder();
	}
	
	pushDownOrder(index) {
		this.selectedDraft.ingredients[index].order++;
		this.selectedDraft.ingredients[index+1].order--; 
		this.sortIngredientsOrder();
	}
	
	sortIngredientsOrder() {
		this.selectedDraft.ingredients.sort((ingA, ingB) => {
			if (ingA.order < ingB.order) return -1;
			if (ingA.order > ingB.order) return 1; 
			return 0;
		}); 
	}

}
