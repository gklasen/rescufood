import { Injectable } from '@angular/core';  
import { first } from 'rxjs';
import { RecipesService } from './recipes.service'; 
import { IngredientParser } from '../utils/ingredient_parser'; 
import { HttpHeaders, HttpClient } from '@angular/common/http'; 
import { TranslateService } from '@ngx-translate/core';

import { IngredientsService } from './ingredients.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeParserService {   

	constructor(
		public recipesService: RecipesService, 
		public http: HttpClient,
		public translate: TranslateService, 
		public ingredientsService: IngredientsService) { 
	} 
	
	parseRecipe(url: string) { 
		let env = this;
		return new Promise((resolve, reject) => {
			env.recipesService.getRecipeURLs().pipe(first()).subscribe((recipeUrls) => { 
				
				
				if(!recipeUrls.includes(url)) {
					
					const httpOptions: Object = {
						responseType: 'html'
					};
					
					env.http.get(url, httpOptions ).subscribe((entirePageHTML: any) => {
						
						var recipeResult = {}
						
						//body from Chefkoch URL
						//var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(entirePageHTML)[1];
						var doc = document.createElement("html");
						doc.innerHTML = entirePageHTML; 
						var infoData = JSON.parse(doc.querySelectorAll("*[type='application/ld+json']")[1].innerHTML);
						infoData.difficulty = JSON.parse(doc.querySelectorAll("*[id='gujAdConfig']")[0].innerHTML).keywords[1];
						
						recipeResult['url'] = url;
						recipeResult['title'] = {};
						recipeResult['title']['de'] = this.getTitle(infoData);
						recipeResult['title']['en'] = this.translate.instant("INGREDIENTS.ENTRY");
						recipeResult['category'] = this.getCategory(infoData);
						recipeResult['duration_prep'] = this.getDuration(doc.innerHTML, "Arbeitszeit");
						recipeResult['duration_cook'] = this.getDuration(doc.innerHTML, "Koch-\/Backzeit");
						recipeResult['duration_rest'] = this.getDuration(doc.innerHTML, "Ruhezeit");
						recipeResult['duration_total'] = this.getDuration(doc.innerHTML, "Gesamtzeit");
						recipeResult['portions'] = this.getPortions(infoData);
						recipeResult['difficulty'] = this.getDifficulty(doc);
						recipeResult['vegetarian'] = this.getVegetarian(infoData);
						recipeResult['vegan'] = this.getVegan(infoData);
						recipeResult['description'] = {};
						recipeResult['description']['de'] = this.getDescription(infoData);
						recipeResult['description']['en'] = this.translate.instant("INGREDIENTS.ENTRY");
						recipeResult['ingredients'] = [];
						 
						var ingredientsParams = IngredientParser.prepareIngredients(infoData.recipeIngredient); 
						var namesFromIngredients = ingredientsParams.map( params => params[2]);
						
						env.ingredientsService.getIngredientsByMultipleNames(namesFromIngredients).pipe(first()).subscribe((realIngredients) => {
							
							console.log("realIngredients",namesFromIngredients, realIngredients.map((s) => s.id) )
							
							for(var index = 0; index < ingredientsParams.length; index++) { 
							
								var realIngredient = realIngredients.find((ri) => { 
									return ri.names[this.translate.currentLang].includes(ingredientsParams[index][2])
								});
								
								console.log("realIngredient",realIngredient)
							
								var ingredient = {
									order: index+1,
									value: Number(ingredientsParams[index][0]),
									unit: ingredientsParams[index][1],
									name: realIngredient ? realIngredient.id : "dummy",
									optional: ingredientsParams[index][3] ? true : false,
									category: realIngredient ? realIngredient.category : "",
									icon: realIngredient ? realIngredient.icon : "dummy"
								}
								recipeResult['ingredients'].push(ingredient);
							} 
							  
							resolve(recipeResult);
						});
						
						
						
						
					})
					
				} else {
					reject(false);
				}
			});
		});
	}
	
	getTitle(infoData) {
		return infoData.name.trim();
	}
	
	getCategory(infoData) {
		if(infoData.keywords.includes("Nachspeise") || infoData.keywords.includes("Dessert")) {
			return "dessert"
		} else if(infoData.keywords.includes("Hauptspeise")) {
			return "maindish"
		} else if(infoData.keywords.includes("Vorspeise")) {
			return "starter"
		} else if(infoData.keywords.includes("Frühstück")) {
			return "breakfast"
		} else if(infoData.keywords.includes("Salat")) {
			return "salad"
		} else if(infoData.keywords.includes("Suppe")) {
			return "soup"
		} else if(infoData.keywords.includes("Beilage")) {
			return "garnish"
		} else if(infoData.keywords.includes("Brot oder Brötchen") || infoData.keywords.includes("Brotspeise")) {
			return "bread"
		} else if(infoData.keywords.includes("Kuchen") || infoData.keywords.includes("Kekse")) {
			return "cake"
		} else if(infoData.keywords.includes("Snack")) {
			return "snack"
		} else if(infoData.keywords.includes("Saucen") || infoData.keywords.includes("Dips")) {
			return "dips"
		} else if(infoData.keywords.includes("Getränk")) {
			return "drink"
		} else {
			return "snack"
		}
	}
	
	getDuration(htmlData: string, tagText) {
		var duration = 0; 
		
		var spanTags = document.getElementsByTagName("span"); 
		const presenceIndex = htmlData.indexOf(tagText);
		
		if(presenceIndex != -1) {
			var htmlCuttedLeft = htmlData.substring(presenceIndex, htmlData.length - 1);
			var htmlCutted = htmlCuttedLeft.substring(0, htmlCuttedLeft.indexOf("</span>"));
			var words = htmlCutted.split(" ").filter((str) => str !== ''); 
			
			var minutesIndex = words.findIndex(a => a.includes("Minute"));
			if(minutesIndex != -1) {
				duration += Number(words[minutesIndex-1]);
			}
			
			var hoursIndex = words.findIndex(a => a.includes("Stunde"));
			if(hoursIndex != -1) {
				duration += Number(words[hoursIndex-1]) * 60;
			}
			
			var daysIndex = words.findIndex(a => a.includes("Tag"));
			if(daysIndex != -1) {
				duration += Number(words[daysIndex-1]) * 60 * 24;
			}
			
			var weeksIndex = words.findIndex(a => a.includes("Woche"));
			if(weeksIndex != -1) {
				duration += Number(words[weeksIndex-1]) * 60 * 24 * 7;
			}
			
			return duration;
		} else { 
			return 0;
		}
		
	}
	
	getPortions(infoData) {
		return Number(infoData.recipeYield.split(" ")[0]);
	}
	
	getDifficulty(doc) {
		var difficulty = JSON.parse(doc.querySelectorAll("*[id='gujAdConfig']")[0].innerHTML).keywords[1];
		switch(difficulty) {
			case "simpel":
				return 0;
			case "normal":
				return 1;
			default:
				return 2;
		} 
	}
	
	getVegetarian(infoData) {
		return infoData.keywords.includes("Vegetarisch"); 
	}
	
	getVegan(infoData) { 
		return infoData.keywords.includes("Vegan");
	}
	
	getDescription(infoData) {
		return infoData.recipeInstructions.trim();
	}
	
}
