import { Injectable, inject } from '@angular/core';   
import { Firestore, collection, collectionSnapshots, doc, setDoc, addDoc } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, find, first } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { IDGenerator } from '../utils/idgenerator'
import { IngredientsService } from './ingredients.service';

import { Notification } from '@electron/remote'; 
import * as path from 'path'; 

@Injectable({
  providedIn: 'root'
})
export class RecipesService { 

	recipes$: Observable<any[]>;
	recipeValues$: Observable<any>;
	
	private firestore: Firestore = inject(Firestore); // inject Cloud Firestore

	constructor(public translate: TranslateService, public ingredientsService: IngredientsService) {
		this.loadRecipesFromFirebase();  
	}
	
	loadRecipesFromFirebase() {
		const recipesCollection = collection(this.firestore, 'recipes');
		this.recipes$ = collectionSnapshots(recipesCollection).pipe(
			map(actions => {
				var recipes	= actions.map(a => {
					var recipeObj = a.data();
					recipeObj.id = a.id;
					recipeObj.difficulty = recipeObj.difficulty.toString(); 
					return recipeObj;
				});
				
				return recipes;
			})
		); 
	} 
	
	getRecipes(): Observable<any> {
		return this.recipes$;
	}  
	
	getRecipeURLs() {
		return this.getRecipes().pipe(map(recipes => recipes.map((recipe) => recipe.url))); ;
	}  
	
	getRecipeById(id: string) {
		return this.getRecipes().pipe(
			map(recipes => recipes.find((recipe) => {
				
				if(!recipe.duration_prep) recipe.duration_prep = 0;
				if(!recipe.duration_cook) recipe.duration_cook = 0;
				if(!recipe.duration_rest) recipe.duration_rest = 0;
				if(!recipe.duration_total) recipe.duration_total = 0;
				if(!recipe.author) recipe.author = "";
				if(!recipe.author_mail) recipe.author_mail = "";
				if(!recipe.vegetarian) recipe.vegetarian = false;
				if(!recipe.vegan) recipe.vegan = false;
			
				return recipe.id === id
			}))
		);  
	}
	
	getDummyRecipe() { 
		return new Promise((resolve, reject) => {
			var dummyRecipe = {}; 
			var dummyValue = this.translate.instant("INGREDIENTS.ENTRY");
					
			dummyRecipe['id'] = IDGenerator.generateFirebaseID(); 
			dummyRecipe['category'] = 'maindish'; 
			dummyRecipe['description'] = {}; 
			dummyRecipe['description']['de'] = dummyValue;  
			dummyRecipe['description']['en'] = dummyValue;
			dummyRecipe['difficulty'] = 0;
			dummyRecipe['duration_prep'] = 0;
			dummyRecipe['duration_cook'] = 0;
			dummyRecipe['duration_rest'] = 0;
			dummyRecipe['duration_total'] = 0;
			dummyRecipe['portions'] = 0;
			dummyRecipe['title'] = {}; 
			dummyRecipe['title']['de'] = dummyValue;  
			dummyRecipe['title']['en'] = dummyValue;
			dummyRecipe['vegetarian'] = false;
			dummyRecipe['vegan'] = false;
			dummyRecipe['url'] = '';
			dummyRecipe['author'] = '';
			dummyRecipe['author_mail'] = '';
			dummyRecipe['ingredients'] = [];
			
			this.ingredientsService.getDummyIngredient().pipe(first()).subscribe((dummy) => {  
				for(var i = 0; i < 3; i++) {
					let clone = Object.assign({}, dummy) // Copies user into clone
					clone['order'] = i + 1;
					clone['unit'] = "gram";
					clone['value'] = 0; 
					clone['name'] = "dummy"; 
					dummyRecipe['ingredients'].push(clone);
				}
			
				resolve(dummyRecipe);
			});
		}); 
	}
	
	addRecipe(recipe: any) { 
		return new Promise((resolve, reject) => {
			const recipesCollection = collection(this.firestore, 'recipes');
			addDoc(recipesCollection, recipe).then(() => {
				resolve(true);
			}).catch((e) => {
				reject(e);
			});
		}); 
	}

	updateRecipe(recipe: any) { 
		return new Promise((resolve, reject) => {
			const recipeDoc = doc(this.firestore, 'recipes/'+recipe['id']);
			delete recipe['id'];
			setDoc(recipeDoc, recipe).then(() => {
				resolve(true);
			}).catch((e) => {
				reject(e);
			});
		}); 
	}	
}
