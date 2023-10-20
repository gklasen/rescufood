import { Injectable, inject } from '@angular/core';   
import { Firestore, collection, collectionSnapshots, doc, setDoc } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, find, first } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService { 

	ingredients$: Observable<any[]>;
	ingredientValues$: Observable<any>;
	
	private firestore: Firestore = inject(Firestore); // inject Cloud Firestore

	constructor(public translate: TranslateService) {
		this.loadIngredientsFromFirebase();
		this.loadIngredientValues();
	}
	
	loadIngredientsFromFirebase() {  
		
		const ingredientsCollection = collection(this.firestore, 'ingredients');
		this.ingredients$ = collectionSnapshots(ingredientsCollection).pipe(
			map(actions => {
				var ings = actions.map(a => {
					var ingredientObj = a.data();
					ingredientObj.id = a.id; 
					return ingredientObj;
				});
				
				ings.push(this.getDummyTemplate());
			 
				return ings;
			}) 
		)  
	}
	
	loadIngredientValues() {
		const ingredientValuesCollection = collection(this.firestore, 'own_ingredient');
		this.ingredientValues$ = collectionSnapshots(ingredientValuesCollection).pipe(
			map(actions => actions.flatMap(a => a.data().units))
		); 
	}
	
	getIngredients() {
		return this.ingredients$;
	}   
	
	getIngredientIDs() {
		return this.getIngredients().pipe(map(ingredients => ingredients.map((ingredient) => ingredient.id))); 
	}  
	
	getAllIngredientUnits() { 
		return this.ingredientValues$;
	}	
	
	getIngredientById(id: string) {
		return this.getIngredients().pipe(map(ingredients => ingredients.find((ingredient) => ingredient.id === id))); 
	} 
	
	getCategories() {
		return this.getIngredients().pipe(
			map(ingredients => {
				var categories = {};
				
				for(var ingredient of ingredients) {
					//console.log(categories);
					if(ingredient.category) { 
						if(!categories[ingredient.category]) {
							categories[ingredient.category] = []; 
						}  
						categories[ingredient.category].push(ingredient.id);  
					}  
				}
				
				Object.keys(categories).sort((a, b) => {
					if(this.translate.instant("CATEGORIES."+a.toUpperCase()) > this.translate.instant("CATEGORIES."+b.toUpperCase())) {
						return 1; 
					} else {
						return -1;
					}
				}); 
				
				console.log("SD", categories );
				
				return categories;
			}) 
		); 
	} 

	
	getIngredientByName(requestedName: string) {
		return this.getIngredients().pipe(
			map(ingredients => ingredients.find((ingredient) => {
				var nameIncluded = false;
				for(var name of ingredient.names[this.translate.currentLang]) {
					if(requestedName === name) nameIncluded = true;
				} 
				return nameIncluded;
			}))
		); 
	} 

	getIngredientsByMultipleIds(ids: string[]) {
		return this.getIngredients().pipe(map(ingredients => ingredients.filter((ingredient) => ids.includes(ingredient.id)))); 
	} 

	getIngredientsByMultipleNames(names: string[]) {
		return this.getIngredients().pipe(
			map(ingredients => ingredients.filter((ingredient) => {
				return ingredient.names[this.translate.currentLang].some((n) => { 
					return names.includes(n); 
				})
			})
		)); 
	} 	
	
	getIngredient(id: string) { 
		id = unescape(id);
		return combineLatest([
			this.getIngredientById(id),
			this.getAllIngredientUnits()
		]).pipe(
			map(([chosen_ingredient, possible_units]) => {
				
				
				console.log(id, chosen_ingredient, possible_units);
				
				var unitnames_from_ingredient = chosen_ingredient.units.map(unit => unit.name);
				
				
				if(!chosen_ingredient['defaultStoreroom']) chosen_ingredient['defaultStoreroom'] = false;
				if(!chosen_ingredient['defaultIgnoreList']) chosen_ingredient['defaultIgnoreList'] = false;
				if(!chosen_ingredient['category']) chosen_ingredient['category'] = "";
				
				//Enrich existing units by missing params
				for(var existingUnits of chosen_ingredient.units) {
					if(!existingUnits['factor']) {
						existingUnits['factor'] = 0;
					}
					
					if(!existingUnits['defaultUnit']) existingUnits['defaultUnit'] = false;  
				}
				
				//Add other units not being part yet.
				for(var possible_unit of possible_units) {
					if(!unitnames_from_ingredient.includes(possible_unit.name)) {
						chosen_ingredient.units.push({
							name: possible_unit.name, 
							value: 0, 
							factor: 0, 
							defaultUnit: false 
						});
					}  
				}
				console.log("results", unitnames_from_ingredient, chosen_ingredient, possible_units); 
				return chosen_ingredient;
			})
		);
	}
	
	getDummyTemplate() {
		var dummyIngredient = {};
		
		dummyIngredient['id'] = 'dummy';
		dummyIngredient['icon'] = 'dummy';
		dummyIngredient['category'] = ''; 
		dummyIngredient['names'] = {}; 
		dummyIngredient['names']['de'] = []; 
		dummyIngredient['names']['de'][0] = this.translate.instant("INGREDIENTS.ENTRY");
		dummyIngredient['names']['en'] = []; 
		dummyIngredient['names']['en'][0] = this.translate.instant("INGREDIENTS.ENTRY");
		dummyIngredient['units'] = []; 
		dummyIngredient['units']['gram'] = 0; 
		dummyIngredient['defaultStoreroom'] = false;
		dummyIngredient['defaultIgnoreList'] = false;
		
		return dummyIngredient;
	}

	
	getDummyIngredient() { 
	
		return this.getAllIngredientUnits().pipe(
			map(units => {
				var dummyIngredient = this.getDummyTemplate();
				
				for(var possible_unit of units) { 
					dummyIngredient['units'].push({
						name: possible_unit.name, 
						value: 0, 
						factor: 0, 
						defaultUnit: false, 
						optional: false
					}); 
				}
				
				return dummyIngredient;
			})
		);			
	
		
	}
	
	updateIngredient(ingredient: any) { 
		return new Promise((resolve, reject) => {
			const ingredientDoc = doc(this.firestore, 'ingredients/'+ingredient['id'].toLowerCase());
			delete ingredient['id'];
			setDoc(ingredientDoc, ingredient).then(() => {
				resolve(true);
			}).catch((e) => {
				reject(e);
			});
		}); 
	} 	
}
