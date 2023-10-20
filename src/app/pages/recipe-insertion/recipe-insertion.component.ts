import { Component, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import xlsx from 'node-xlsx';
import { Firestore, getDocs, collection, CollectionReference, collectionData, docSnapshots, doc, addDoc, updateDoc } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as fs from 'fs-extra';
const {Translate} = require('@google-cloud/translate').v2;
const { app } = require('@electron/remote');
import { AlertService } from '@full-fledged/alerts';

var basepath = app.getAppPath();

// Instantiates a client
const googleTranslation = new Translate({
	projectId: "foodpuzzle-2ee52", //eg my-project-0o0o0o0o'
	keyFilename: 'Foodpuzzle-f7c42f10314a.json' //eg my-project-0fwewexyz.json
});

import { TranslateService } from '@ngx-translate/core'; 
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, Subject, map  } from 'rxjs';  
import { AlertModule } from '@full-fledged/alerts';
 
@Component({
  selector: 'app-recipe-insertion',
  templateUrl: './recipe-insertion.component.html',
  styleUrls: ['./recipe-insertion.component.scss']
})
export class RecipeInsertionComponent implements AfterViewInit  { 

	private ingredientCollection: CollectionReference<any>;
	ingredientsFromExcel: any;

	input_url: any; 
	input_title_de: any;
	input_title_en: any;
	input_description_de: any;
	input_description_en: any;
	input_category: any;
	
	input_prep_time: any;
	input_cook_time: any;
	input_rest_time: any;
	input_total_time: any;
	input_portions: any;
	input_difficulty: any;
	input_vegetarian: any;
	input_vegan: any;
	recipeTable: any;
	
	urls = [];
	recipes = [];
	ingredients = [];
	
	constructor(private router: Router, public firestore: Firestore, public zone: NgZone,
		public translate: TranslateService, public http: HttpClient, public alertService: AlertService) {
		this.ingredients = this.router.getCurrentNavigation().extras.state.ingredients;
	}
		
		
	async parseURL() {
		const httpOptions: Object = {
			responseType: 'html'
		};
		let env = this;
		
		//console.log(env.urls, env.input_url.value)
		
		if(env.urls.includes(env.input_url.value)) this.alertService.warning("Warnung: Rezept schon angelegt.")
		env.http.get(env.input_url.value, httpOptions ).subscribe((entirePageHTML: any) => {
			
			//body from Chefkoch URL
			//var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(entirePageHTML)[1];
			var doc = document.createElement("html");
			doc.innerHTML = entirePageHTML;
			var infoData = JSON.parse(doc.querySelectorAll("*[type='application/ld+json']")[1].innerHTML);
			infoData.difficulty = JSON.parse(doc.querySelectorAll("*[id='gujAdConfig']")[0].innerHTML).keywords[1];
			
			console.log(infoData)
			//console.log(doc.innerHTML)
	
			env.input_title_de.value = infoData.name.trim();
			env.input_portions.value = infoData.recipeYield.split(" ")[0];
			
			if(infoData.keywords.includes("Nachspeise") || infoData.keywords.includes("Dessert")) {
				env.input_category.value = "dessert"
			} else if(infoData.keywords.includes("Hauptspeise")) {
				env.input_category.value = "maindish"
			} else if(infoData.keywords.includes("Vorspeise")) {
				env.input_category.value = "starter"
			} else if(infoData.keywords.includes("Frühstück")) {
				env.input_category.value = "breakfast"
			} else if(infoData.keywords.includes("Salat")) {
				env.input_category.value = "salad"
			} else if(infoData.keywords.includes("Suppe")) {
				env.input_category.value = "soup"
			} else if(infoData.keywords.includes("Beilage")) {
				env.input_category.value = "garnish"
			} else if(infoData.keywords.includes("Brot oder Brötchen") || infoData.keywords.includes("Brotspeise")) {
				env.input_category.value = "bread"
			} else if(infoData.keywords.includes("Kuchen") || infoData.keywords.includes("Kekse")) {
				env.input_category.value = "cake"
			} else if(infoData.keywords.includes("Snack")) {
				env.input_category.value = "snack"
			} else if(infoData.keywords.includes("Saucen") || infoData.keywords.includes("Dips")) {
				env.input_category.value = "dips"
			} else if(infoData.keywords.includes("Getränk")) {
				env.input_category.value = "drink"
			} else {
				env.input_category.value = "snack"
			}   
			
			var prepTime: any;
			if(infoData.prepTime) {
				prepTime = infoData.prepTime.split(/([0-9]+)/);
				prepTime = parseInt(prepTime[1]) * 24 * 60 + parseInt(prepTime[3]) * 60 + parseInt(prepTime[5]);
				env.input_prep_time.value = prepTime;
			} else {
				prepTime = 0;
			}			
			
			
			var cookTime: any;
			if(infoData.cookTime) {
				cookTime = infoData.cookTime.split(/([0-9]+)/);
				cookTime = parseInt(cookTime[1]) * 24 * 60 + parseInt(cookTime[3]) * 60 + parseInt(cookTime[5]);
				env.input_cook_time.value = cookTime;
			} else {
				cookTime = 0;
			}			
			
			
			var totalTime: any;
			if(infoData.totalTime) {
				totalTime = infoData.totalTime.split(/([0-9]+)/);
				totalTime = parseInt(totalTime[1]) * 24 * 60 + parseInt(totalTime[3]) * 60 + parseInt(totalTime[5]);
				env.input_total_time.innerHTML = totalTime;
			} else {
				totalTime = 0;
			}			
			var restTime: any = totalTime - prepTime - cookTime;
			if(restTime != 0) env.input_rest_time.value = restTime
			
			if(infoData.difficulty === "simpel") {
				this.input_difficulty.value = "0"
			} else if(infoData.difficulty === "normal") {
				this.input_difficulty.value = "1"
			} else {
				this.input_difficulty.value = "2"
			}
			
			this.input_vegetarian.checked = infoData.keywords.includes("Vegetarisch");
			this.input_vegan.checked = infoData.keywords.includes("Vegan");
			
			this.input_description_de.value = infoData.recipeInstructions.trim();
			
			
			//english part
			this.translation();
				 
			
			this.textAreaAdjust("input_description_de")
			
			var ingredient_parts = env.prepareIngredients(infoData.recipeIngredient);
			console.log("needed parts!",ingredient_parts) 
			ingredient_parts.forEach((parts, index) => {

				var ingredient_amount = parts[0];
				var ingredient_unit = parts[1];
				var ingredient_name = parts[2].toLowerCase();
				var ingredient_optional = parts[3];
				
				
				var amtElem = (<HTMLInputElement>document.getElementById("amount_ingredient"+(index+1)));
				if(amtElem !== null) amtElem.value = ingredient_amount;
				
				var btnElem = (<HTMLInputElement>document.getElementById("button_ingredient"+(index+1)));
				
				var autoCompleteResult = env.matchIngredients(ingredient_name);  
				if(autoCompleteResult && autoCompleteResult.length > 0 && btnElem !== null) {
					btnElem.disabled = false;
					btnElem.innerHTML = autoCompleteResult[0].split(",")[0];
					btnElem.click();
				}
				
				var selElem = (<HTMLSelectElement>document.getElementById("select_ingredient_unit"+(index+1)));
				if(selElem !== null) selElem.value = ingredient_unit;
				
				var optElem = (<HTMLInputElement>document.getElementById("optional_ingredient"+(index+1)));
				if(optElem !== null) optElem.checked = parts[3] !== undefined;
				
				//console.log(ingredient_unit.options, selElem)
					
			});
				
		}); 
	}
	
	translateRecipe() {
		let env = this;
		googleTranslation.translate(env.input_title_de.value + "-----"+ this.input_description_de.value , "en").then((translation: string) => { 
			console.log(translation)
			var parts = translation[0].toString().split("-----");
			env.input_title_en.value = parts[0].trim(); 
			env.input_description_en.value = parts[1].trim(); 
			this.textAreaAdjust("input_description_en")
		}, (error) => {
			console.log(error)
		});
	}
	
	prepareIngredients(ingredients) {
		var ingredientParts = [];
		//var parts = ingredients.split(" ");
		console.log("needed ingredients",ingredients)
		//remove whitespace from start
		ingredients.forEach((ingredient, index) => {
			var parts = ingredient.split(" ");
			console.log("needed parts",parts)
			if(parts[0] === "" || parts[0] === "etwas" || parts[0] === "einige" || parts[0] === "evtl.") {
				if(parts[0] === "evtl.") parts[3] = "optional"
				parts[0] = "0";
				parts[2] = parts[1];
				parts[1] = "some";
			}
			if(parts[0] === "evtl.") parts[3] = "optional"
			
			
			if(parts[0] === "n." && parts[1] === "B.")	{ 
				parts[0] = "0";
				parts[1] = "some";
				parts[3] = "optional"
				
			}
			if(parts[0] === "⅛") parts[0] = "0.125";
			if(parts[0] === "¼") parts[0] = "0.25";
			if(parts[0] === "½") parts[0] = "0.5";
			if(parts[0] === "¾") parts[0] = "0.75";
			
			if(parts[0] === "1" && parts[1] === "½") {
				parts[0] = "1.5";
				parts[1] = parts[2];
				parts[2] = parts[3];
			}
			if(parts[0] === "2" && parts[1] === "½") {
				parts[0] = "2.5";
				parts[1] = parts[2];
				parts[2] = parts[3];
			}
			if(parts[0] === "3" && parts[1] === "½") {
				parts[0] = "3.5";
				parts[1] = parts[2];
				parts[2] = parts[3];
			}
			
			if(parts[0].includes(",")) {
				if(parts[0].length === 3) {
					parts[0] = parts[0].replace(/,/g, ".");
				} else {
					parts[0] = parts[0].replace(/,/g, "");
				}
			} 
			if(parts[1].charAt(parts[1].length-1) === ",") parts[1] = parts[1].substring(0, parts[1].length - 1);
			if(parts[1] === "") parts[1] = "piece"; 
			if(parts[1] === "ml") parts[1] = "milliliter";
			if(parts[1] === "g") parts[1] = "gram";
			if(parts[1] === "Liter") {
				parts[0] = (parseFloat(parts[0])*1000).toString();
				parts[1] = "milliliter";
			}
			if(parts[1] === "kg") { 
				parts[0] = (parseFloat(parts[0])*1000).toString();
				parts[1] = "gram";
			}
			if(parts[1] === "TL") parts[1] = "teaspoon";
			if(parts[1] === "EL," && parts[2] === "gestr.") {
				parts[1] = "EL";
				parts[2] = parts[3];
			}
			if(parts[1] === "EL") parts[1] = "tablespoon";
			if(parts[1] === "Becher") parts[1] = "cup";
			if(parts[1] === "Pck.") parts[1] = "package";
			if(parts[1] === "Pkt.") parts[1] = "package";
			if(parts[1] === "Tüte/n") parts[1] = "package";
			if(parts[1] === "Packung") parts[1] = "package";
			if(parts[1] === "Beutel") parts[1] = "bag";
			if(parts[1] === "m.-große") parts[1] = "piece";
			if(parts[1] === "m.-großes") parts[1] = "piece";
			if(parts[1] === "große") parts[1] = "piece_big"; 
			if(parts[1] === "Stange/n") parts[1] = "piece";
			if(parts[1] === "Scheibe/n") parts[1] = "slice"; 
			if(parts[1] === "Kopf") parts[1] = "piece";  
			if(parts[1] === "kleine") parts[1] = "piece_small"; 
			if(parts[1] === "kleiner") parts[1] = "piece_small";
			if(parts[1] === "kl.") parts[1] = "piece_small";   
			if(parts[1] === "Würfel") parts[1] = "cube"; 
			if(parts[1] === "Handvoll") parts[1] = "handful";   
			if(parts[1] === "große") parts[1] = "piece_big"; 
			if(parts[1] === "Msp.") parts[1] = "knifetip"; 
			if(parts[1] === "Glas") parts[1] = "glass";			
			if(parts[1] === "Zehe/n") parts[1] = "clove";
			if(parts[1] === "Zehe") parts[1] = "clove";  
			if(parts[1] === "Dose/n") parts[1] = "can";
			if(parts[1] === "Dose") parts[1] = "can";
			if(parts[1] === "gr. Dose/n") parts[1] = "can_big";    
			if(parts[1] === "gr. Dose") parts[1] = "can_big";
			if(parts[1] === "Zweig/e") parts[1] = "stalk";
			if(parts[1] === "Blätter") parts[1] = "leaf"; 
			if(parts[1] === "Bund") parts[1] = "bunch";      
			if(parts[1] === "Prise(n)") parts[1] = "some"; 
			if(parts[1] === "Prisen") parts[1] = "some";        
			if(parts[1] === "Schuss") parts[1] = "some";
			if(parts[1] === "Tasse/n") parts[1] = "mug";
			if(parts[1] === "Tropfen") parts[1] = "drop";
			  
			if(parts[2] === "gestr.") {  
				parts.splice(1,1);
			}  
			  
			if(ingredient.includes("Salz und Pfeffer")) { 
				parts = ["0","some","Salz"];
				ingredientParts.push(parts);
				parts = ["0","some","Pfeffer"];  
			}
			if(parts[3] === ",") {  
				parts.splice(3,1);
			}
			
			if(parts[1] === "some") parts[0] = "0";
			
			
			if(parts[2] === "Semmelbrösel") parts[2] = "Paniermehl";
			if(parts[2] === "Toastbrot") parts[2] = "Toast";
			if(parts[2] === "Äpfel") parts[2] = "Apfel";
			if(parts[2] === "Mandel(n)") parts[2] = "Mandelblatt";
			if(parts[2] === "Tomate(n) , gehackte") parts[2] = "gehackte Tomate";
			if(parts[2] === "Tomate(n), geschälte") parts[2] = "geschälte Tomate"; 
			if(parts[2] && parts[2].charAt(parts[2].length-1) === ",") parts[2] = parts[2].substring(0, parts[2].length - 1);
			if(parts[2] === "Salatherz(en)") parts[2] = "Romanasalat";
			if(parts[2] === "Speck" || parts[2] === "Schinkenspeck") parts[2] = "Schinken (gewürfelt)";
			if(parts[2] === "Möhre(n)") parts[2] = "Karotte";
			if(parts[2] === "Walnüsse") parts[2] = "Walnuss";
			if(parts[2] === "Brezel(n)") parts[2] = "Laugenbrezel";
			if(parts[2] === "Semmel(n)") parts[2] = "Brötchen";
			if(parts[2] === "Garnele(n)") parts[2] = "Garnele";
			if(parts[2] === "Aubergine(n)") parts[2] = "Aubergine"; 
			if(parts[2] === "Weizenmehl") parts[2] = "Mehl";  	
			if(parts[2] === "Frühlingszwiebel(n)") parts[2] = "Frühlingszwiebel"; 
			if(parts[2] === "Lauchzwiebel(n)") parts[2] = "Frühlingszwiebel"; 
			if(parts[2] === "Rohrzucker") parts[2] = "Brauner Zucker";
			if(parts[2] === "Hähnchenbrustfilet(s)") parts[2] = "Hähnchenbrustfilet";
			 
			
			if(parts[2] && parts[2].includes("Sud")) parts[2] = "Wasser";
			   
			if(parts[2] === "Gewürzgurke(n)") parts[2] = "Gewürzgurke";  
			if(parts[2] === "Oblaten") parts[2] = "Oblate";
			if(parts[2] === "Oliven") parts[2] = "Olive";
			if(parts[2] === "Kürbis(se)") parts[2] = "Hokkaidokürbis";			
			
			
			if(parts[2] === "Staudensellerie") parts[2] = "Stangensellerie";   
			if(parts[2] === "Feta-Käse") parts[2] = "Fetakäse";  
			if(parts[2] === "Tomatenpüree") parts[2] = "Pürierte Tomate";	  
			if(parts[2] === "Pasta") parts[2] = "Nudeln";
			if(parts[2] === "Bacon") parts[2] = "Speck";
			if(parts[2] === "Partytomate") parts[2] = "Kirschtomate";			
			if(parts[2] === "Cocktailtomaten") parts[2] = "Kirschtomate";	     
			if(parts[2] === "Gemüsezwiebel(n)") parts[2] = "Gemüsezwiebel"; 
			if(parts[2] === "Cornichons") parts[2] = "Gewürzgurke"; 			
			if(parts[2] && parts[2].includes("Fett")) parts[2] = "Butter";			       
			if(parts[2] === "Porree") parts[2] = "Lauch";  
			if(parts[2] === "Erdbeeren") parts[2] = "Erdbeere"; 
			if(parts[2] === "Vanillinzucker") parts[2] = "Vanillezucker"; 
			if(parts[2] === "Fladenbrot(e)") parts[2] = "Fladenbrot";  
			   
			if(parts[2] === "Zucker" && parts[3] === "braun" ) parts[2] = "brauner Zucker"; 
			if(parts[2] === "Wein" && parts[3] === "weiß" ) parts[2] = "Weißwein"; 
			if(parts[2] === "Wein" && parts[3] === "rot" ) parts[2] = "Rotwein"; 
			if(parts[2] === "Tomate(n)" && parts[3] === "getrocknete" ) parts[2] = "Getrocknete Tomate"; 
			if(parts[2] === "Tomate(n)" && parts[3] === "getrocknet" ) parts[2] = "Getrocknete Tomate"; 
			if(parts[2] === "Champignons" && parts[3] === "braune" ) parts[2] = "Brauner Champignon"; 
			if(parts[2] === "Brühe" && parts[3] === "," && parts[4] === "instant") parts[2] = "Brühe"; 
			if(parts[2] === "Käse" && parts[3] === "," && parts[4] === "geriebener") parts[2] = "geriebener Käse"; 
			if(parts[2] === "Käse," && parts[3] === "geriebener") parts[2] = "geriebener Käse"; 
			if(parts[2] === "Mandel(n)" && parts[3] === "," && parts[4] === "gemahlen") parts[2] = "gemahlene Mandeln"; 
			if(parts[2] === "Paprikaschote(n)" && parts[3] ===  "gelb") parts[2] = "Gelbe Paprika";  
			if(parts[2] === "Paprikaschote(n)" && parts[3] ===  "rot") parts[2] = "Rote Paprika"; 
			if(parts[2] === "Paprikaschote(n)" && parts[3] ===  "grün") parts[2] = "Grüne Paprika";  
			if(parts[2] === "Himbeeren" && parts[3] === "(TK)") parts[2] = "Himbeeren (tiefgefroren)";  
			if(parts[2] === "Crème" && parts[3] === "fraîche") parts[2] = "Creme Fraiche"; 
			if(parts[2] === "Crème" && parts[3] === "Double") parts[2] = "Creme Double"; 
			if(parts[2] === "Rote" && parts[3] === "Beete") parts[2] = "Rote Beete"; 
			if(parts[2] === "Käse" && parts[3] === "gerieben") parts[2] = "geriebener Käse";  
			if(parts[2] === "Rote" && parts[3] === "Grütze") parts[2] = "Rote Grütze"; 
			if(parts[2] === "Rote" && parts[3] === "Zwiebeln") parts[2] = "Rote Zwiebeln"; 
			if(parts[2] === "Zwiebel(n)" && parts[3] === "rote") parts[2] = "Rote Zwiebeln";   
			if(parts[2] === "Knoblauchzehe(n)") {       
				parts[1] = "clove";    
				parts[2] = "Knoblauch";  
			}    
			//if(parts[2].includes("Knoblauchzehe(n)")) parts[2] = "Schokolade";  
			if(parts[2] === "Spargel" && parts[3] === "weiß") parts[2] = "Weißer Spargel";
			if(parts[2] === "Spargel" && parts[3] === "grün") parts[2] = "Grüner Spargel";   
			if(parts[2] === "Zucker" && parts[3] === "brauner" ) parts[2] = "Brauner Zucker"; 
			
			if(parts[3] && parts[3] === "zartbitter") parts[2] = "Zartbitterschokolade"; 
			if(parts[3] && parts[3].includes("Amarettini")) parts[2] = "Amarettini"; 
		 
			console.log("corrected parts",parts)
		 
			while(parts.length > 3) {   
				if(parts[parts.length-1] === "optional") break;
				parts.pop();  
			}
			
			
			ingredientParts.push(parts);
		});
		
		
		//split shared ingredients
		
		
		return ingredientParts;
	}
	
	ngAfterViewInit(): void {
		
		this.input_url = (<HTMLInputElement>document.getElementById("input_url"))
		this.input_title_de = (<HTMLInputElement>document.getElementById("input_title_de"))
		this.input_title_en = (<HTMLInputElement>document.getElementById("input_title_en"))
		this.input_description_de = (<HTMLTextAreaElement>document.getElementById("input_description_de"))
		this.input_description_en = (<HTMLTextAreaElement>document.getElementById("input_description_en"))
		this.input_category = (<HTMLSelectElement>document.getElementById("input_recipe_category"))
		this.input_portions = (<HTMLInputElement>document.getElementById("input_portions"))
		this.input_prep_time = (<HTMLInputElement>document.getElementById("input_duration_prep"))
		this.input_cook_time = (<HTMLInputElement>document.getElementById("input_duration_cook"));
		this.input_rest_time = (<HTMLInputElement>document.getElementById("input_duration_rest"));
		this.input_total_time = document.getElementById("input_duration_total");
		this.input_difficulty = (<HTMLSelectElement>document.getElementById("input_difficulty"));
		this.input_vegetarian = (<HTMLInputElement>document.getElementById("input_vegetarian")); 
		this.input_vegan = (<HTMLInputElement>document.getElementById("input_vegan"));
		
		this.recipeTable =  document.getElementById("recipe_table");
		
		this.ingredientsFromExcel = [];
		this.ingredientsFromExcel = xlsx.parse(basepath+"/Ingredients.xlsx");
		this.ingredientsFromExcel = this.ingredientsFromExcel[0].data;
		this.ingredientsFromExcel.shift(); 
		 
		//extend ingredientData by possible units
		for(var ingredientRow of this.ingredientsFromExcel) {     
			ingredientRow.push([]);  
			var units = ["gram", "milliliter", "piece_small", "piece", "piece_big", "mug", "cup", "can", "can_big", "package", "bag", "glass", "tablespoon", "teaspoon",
				"knifetip", "slice", "bunch", "stalk", "leaf", "handful", "cube", "clove", 	"drop", "roll", "some"]
				
			for(var i = 0; i < units.length; i++) {
				if(ingredientRow[i+6] !== "- , - , -") ingredientRow[ingredientRow.length-1].push(units[i])
			}
		
		}  
		
		console.log(this.ingredientsFromExcel,this.ingredientsFromExcel)
		this.loadRecipesFromFirebase();
	}
	
	checkValueBlocks(event) {
		var btnNr = event.target.id.replace(/\D/g,'')
		var unitElem = (<HTMLSelectElement>document.getElementById("select_ingredient_unit"+btnNr))
		var amountElem = (<HTMLInputElement>document.getElementById("amount_ingredient"+btnNr))
		var unit = unitElem.value
		if(unit === "some") { 
			amountElem.value = "0";
		} else if (unit === "optional") {
			amountElem.disabled = true;
			amountElem.value = "1";
		}
	}
		
	matchIngredients(input) {
		var matches = this.ingredientsFromExcel.filter((ingredient) => {
			var ingredient_name = ingredient[0].split(",")[0].toLowerCase();
			if (ingredient_name.toLowerCase().indexOf(input) > -1) {
				return ingredient;
			}
		});
		
		if(matches.length == 0) {
			matches = this.ingredientsFromExcel.filter((ingredient) => {
				var ingredient_name = ingredient[0].split(",")[0].toLowerCase();
				if (input.indexOf(ingredient_name) > -1) {
					return ingredient;
				}
			});
		}
				
		for(var matched_ingredient of matches) {
			var ingredient_name = matched_ingredient[0].split(",")[0].toLowerCase();
			if(ingredient_name === input) {
				return matched_ingredient;
			}
		}
		
		console.log("matches", matches)
		
		return matches[0];
	}

	changeIngredientGuess(event) { 
		setTimeout(() => {
			var btnNr = event.target.id.replace(/\D/g,'')
			var btnElem = (<HTMLInputElement>document.getElementById("button_ingredient"+btnNr))
			if(event.target.value !== "") {
				var autoCompleteResult = this.matchIngredients(event.target.value.toLowerCase());  
				if(autoCompleteResult && autoCompleteResult.length > 0) {
					btnElem.disabled = false;
					btnElem.innerHTML = autoCompleteResult[0].split(",")[0];
				}
			} else {
				btnElem.disabled = true;
				btnElem.innerHTML = "";
			}
		}); 
	}
	  
	  
	refreshIngredients() {
		this.ngAfterViewInit();
	}
	  
	reset(event) {
		var panelNr = event.target.id.replace(/\D/g,'')
		var ingredientSelectionPanel = document.getElementById("panel_ingredient"+panelNr);
		var ingredientSelectionCatPanel = document.getElementById("panel_ingredient"+panelNr+"_cat"); 
		ingredientSelectionPanel.style.display = "none";
		ingredientSelectionPanel.innerHTML = "";
		ingredientSelectionCatPanel.style.display = "none";
		ingredientSelectionCatPanel.innerHTML = "";
		(<HTMLInputElement> document.getElementById("button_ingredient"+panelNr)).style.display = "";
		(<HTMLInputElement>document.getElementById("input_ingredient"+panelNr)).style.display = "";
        (<HTMLSelectElement>document.getElementById("select_ingredient_unit"+panelNr)).innerHTML = "";
		(<HTMLSelectElement>document.getElementById("select_ingredient_unit"+panelNr)).style.display = "none";
		(<HTMLInputElement>document.getElementById("amount_ingredient"+panelNr)).style.display = "none";
		(<HTMLInputElement>document.getElementById("optional_panel"+panelNr)).style.display = "none";
		(<HTMLInputElement>document.getElementById("optional_ingredient"+panelNr)).style.display = "none";
	}
	 
	setIngredient(event) {
		var panelNr = event.target.id.replace(/\D/g,'')
		var ingredientSelectionPanel = document.getElementById("panel_ingredient"+panelNr);
		var ingredientSelectionCatPanel = document.getElementById("panel_ingredient"+panelNr+"_cat"); 
		ingredientSelectionPanel.style.display = "";
		ingredientSelectionCatPanel.style.display = "";
		ingredientSelectionPanel.innerHTML = event.target.innerHTML.split(",")[0];
		
		var category = this.ingredientsFromExcel.find((name) => { 
			return name[0].split(",")[0] === event.target.innerHTML.split(",")[0]
		})[5]
		
		if(category) ingredientSelectionCatPanel.innerHTML = "Kategorie: "+category;
		
		//console.log("input_ingredient"+panelNr);
		
		(<HTMLInputElement> document.getElementById("button_ingredient"+panelNr)).style.display = "none";
		(<HTMLInputElement>document.getElementById("input_ingredient"+panelNr)).style.display = "none";
		(<HTMLSelectElement>document.getElementById("select_ingredient_unit"+panelNr)).style.display = "";
		
		var units = this.ingredientsFromExcel.find((name) => { 
			return name[0].split(",")[0] === event.target.innerHTML
		});
		
		console.log("UNITS FOR "+event.target.innerHTML+":", units)
		  
		
		var ingredient_unit_selector = (<HTMLSelectElement>document.getElementById("select_ingredient_unit"+panelNr));
		for(var unit of units[units.length-1]) {
			var opt = document.createElement("option");
			opt.value = unit;
			opt.text = this.translate.instant(unit.toUpperCase());
			
			ingredient_unit_selector.add(opt);
		}
		(<HTMLInputElement>document.getElementById("amount_ingredient"+panelNr)).style.display = "";
		(<HTMLInputElement>document.getElementById("optional_panel"+panelNr)).style.display = "";
		(<HTMLInputElement>document.getElementById("optional_ingredient"+panelNr)).style.display = "";
		this.checkValueBlocks(event)
	}
	
	goToOccurances() {
		this.router.navigate(['occurances'], { state: {recipes: this.recipes, ingredients: this.ingredients } } )
	}
	
	totalDuration() {
		var total = 0
		if(this.input_prep_time.value !== "") total += parseInt(this.input_prep_time.value);
		if(this.input_cook_time.value !== "") total += parseInt(this.input_cook_time.value);
		if(this.input_rest_time.value !== "") total += parseInt(this.input_rest_time.value);
		this.input_total_time.innerHTML = total.toString();
	}
 
	textAreaAdjust(id) {
		setTimeout(() => {
			var o = (<HTMLTextAreaElement>document.getElementById(id)); 
			o.style.height = "0";
			o.style.height = o.scrollHeight+"px";
			o.style.marginTop = (o.scrollHeight-20)+"px";
			var text = o.value;
			text = text.replace(/(?:\r|\n|\r\n)/g, '<br>');
		});
	}
 
	async submitRecipesToFirebase() {
		let env = this;
		
		var dataobj = {title: {}, description: {}};
		dataobj['title']['de'] = this.input_title_de.value
		dataobj['title']['en'] = this.input_title_en.value
		dataobj['description']['de'] = this.input_description_de.value;
		dataobj['description']['en'] = this.input_description_en.value;
		dataobj['category'] = this.input_category.value
		
		if(this.input_prep_time.value !== "") dataobj['duration_prep'] = parseInt(this.input_prep_time.value)
		if(this.input_cook_time.value !== "") dataobj['duration_cook'] = parseInt(this.input_cook_time.value)
		if(this.input_rest_time.value !== "") dataobj['duration_rest'] = parseInt(this.input_rest_time.value)
		dataobj['duration_total'] = parseInt(this.input_total_time.innerHTML)
		if(this.input_vegetarian.checked) dataobj['vegetarian'] = true;
		if(this.input_vegan.checked) dataobj['vegan'] = true;
		dataobj['portions'] = parseInt(this.input_portions.value)
		dataobj['difficulty'] = parseInt(this.input_difficulty.value)    
		dataobj['url'] = this.input_url.value
		dataobj['ingredients'] = [];
		console.log(dataobj)
		 
		for(var i = 0; i < 15; i++) {
			var ingredient = {};
			var ingredient_panel = document.getElementById("panel_ingredient"+(i+1));
			if(ingredient_panel.style.display === "") {
				var ingredient_obj = {};
				ingredient_obj['order'] = (i+1) 
				
				var ingObj = env.ingredientsFromExcel.find((name) => { 
					return name[0].split(",")[0] === ingredient_panel.innerHTML
				})
				
				var name = ingObj[1].toLowerCase().split(",")[0]; // english name of wanted ingredient 
				var category = ingObj[5]
				
				var unit = (<HTMLSelectElement>document.getElementById("select_ingredient_unit"+(i+1)))
				ingredient_obj['name'] = name; 
				if(category) ingredient_obj['category'] = category; 
				ingredient_obj['unit'] = unit.value 
				ingredient_obj['value'] = parseFloat((<HTMLInputElement>document.getElementById("amount_ingredient"+(i+1))).value.replace(/,/g, '.'))
				if((<HTMLInputElement>document.getElementById("optional_ingredient"+(i+1))).checked) ingredient_obj['optional'] = true;
				
				dataobj['ingredients'].push(ingredient_obj);
			} 
		}
		 
		const recipeCollection = collection(this.firestore, 'recipes'); 
		addDoc(recipeCollection, dataobj).then(async (docRef) => {
			env.input_title_de.value = ""; 
			env.input_title_en.value = "";
			env.input_description_de.value = "";
			env.input_description_en.value = "";
			env.input_category.value = "";
			env.input_url.value = "";
			env.input_prep_time.value = "";
			env.input_cook_time.value = "";
			env.input_rest_time.value = "";
			env.input_total_time.innerHTML = "";
			env.input_portions.value = "";
			env.input_difficulty.value =  "0";
			env.input_vegetarian.checked = false;
			env.input_vegan.checked = false;
			env.input_description_de.value = "";
			env.input_description_en.value = "";
			
			for(var panelNr = 1; panelNr < 16; panelNr++) { 
				var ingredientSelectionPanel = document.getElementById("panel_ingredient"+panelNr);
				var ingredientSelectionCatPanel = document.getElementById("panel_ingredient"+panelNr+"_cat"); 
				ingredientSelectionPanel.style.display = "none";
				ingredientSelectionPanel.innerHTML = "";
				ingredientSelectionCatPanel.style.display = "none";
				ingredientSelectionCatPanel.innerHTML = "";
				(<HTMLInputElement> document.getElementById("button_ingredient"+panelNr)).style.display = "";
				(<HTMLInputElement>document.getElementById("input_ingredient"+panelNr)).style.display = "";
				(<HTMLSelectElement>document.getElementById("select_ingredient_unit"+panelNr)).innerHTML = "";
				(<HTMLSelectElement>document.getElementById("select_ingredient_unit"+panelNr)).style.display = "none";
				(<HTMLInputElement>document.getElementById("amount_ingredient"+panelNr)).style.display = "none";
				(<HTMLInputElement>document.getElementById("optional_panel"+panelNr)).style.display = "none";
				(<HTMLInputElement>document.getElementById("optional_ingredient"+panelNr)).style.display = "none";
			}

			this.loadRecipesFromFirebase()

		}).catch(function(error) {
			console.error("Error writing document: ", error);
		});
		
	}
	
	//If we have new / other ingredient categories to be updated
	updateRecipeIngredients() {
		let env = this;
		
		for(var recipe of this.recipes) {
			console.log("recipe", recipe)
			var ingredients = []
			for(var ingredient of recipe.ingredients) {
				console.log("ingredient", ingredient)
				
				var ingredientObj = {}; 
				
				var excelIngObj = this.ingredientsFromExcel.find((excelIng) => { 
					var ingredient_name = excelIng[1].split(",")[0].toLowerCase();	//take first english name of an excel ingredient
					return ingredient_name === ingredient.name.toLowerCase();
				})
				var category = excelIngObj[5]
				var ing_name = excelIngObj[1].split(",")[0].toLowerCase();	
				
				ingredientObj['order'] = ingredient.order;
				ingredientObj['name'] = ing_name;
				if(category) ingredientObj['category'] = category; 
				ingredientObj['unit'] = ingredient.unit 
				ingredientObj['value'] = ingredient.value 
				if(ingredient.optional) ingredientObj['optional'] = ingredient.optional; 
				ingredients.push(ingredientObj);
				//env.firestore.collection('recipes').doc(recipe.id).collection('ingredients').doc(ingredient.id).delete();
			}
			
			var docToUpdate = doc(this.firestore, 'recipes/'+recipe.id);  
			updateDoc(docToUpdate, {"ingredients": ingredients}); 
			
		}  
		
		//If recipe update needed later = 
		
		/*var recipeObj = {title: {}, description: {}};
			recipeObj['title']['de'] = recipe.title.de
			recipeObj['title']['en'] = recipe.title.en
			recipeObj['description']['de'] = recipe.description.de
			recipeObj['description']['en'] = recipe.description.en
			recipeObj['category'] = recipe.category 
			if(recipe.duration_prep) recipeObj['duration_prep'] = recipe.duration_prep;
			if(recipe.duration_cook) recipeObj['duration_cook'] = recipe.duration_cook;
			if(recipe.duration_rest) recipeObj['duration_rest'] = recipe.duration_rest;
			recipeObj['duration_total'] = recipe.duration_total;
			if(recipe.vegetarian) recipeObj['vegetarian'] = true;
			if(recipe.vegan) recipeObj['vegan'] = true;
			recipeObj['portions'] = recipe.portions;
			recipeObj['difficulty'] = recipe.difficulty;  
			recipeObj['url'] = recipe.url;  
			recipe.ingredients = [];
		
			env.firestore.collection('recipes').doc(recipeDoc.id).update(recipeObj).then((res) => {
				console.log("res", res, "recipeObj", recipeObj)
			}).catch(function(error) {
				console.error("Error writing document: ", error);
			});

		
		*/
	} 
 
	async loadRecipesFromFirebase() {
		let env = this; 
		while (this.recipeTable.childNodes.length > 2) {
			this.recipeTable.removeChild(this.recipeTable.lastChild);
		}  
		 
		var i = 1;
		env.urls = [];
		
		while (this.recipeTable.childNodes.length > 2) {
			this.recipeTable.removeChild(this.recipeTable.lastChild);
		} 
		 
		var firebaseRecipesQuery = await getDocs(collection(this.firestore, 'recipes'));
		var firebase_recipes = firebaseRecipesQuery.docs;
		
		console.log("recipes",  firebase_recipes);
		
		firebase_recipes.sort((a, b) => {
			return (a.data().title.de < b.data().title.de) ? -1 : (a.data().title.de > b.data().title.de) ? 1 : 0;
		});
		
		this.recipes = [];
		
		firebase_recipes.forEach(async (recipeDoc, index) => {
			var recipe = recipeDoc.data();
			recipe.id = recipeDoc.id
			
			env.urls.push(recipe.url);
			
			recipe.difficulty = (recipe.difficulty == 0) ? "Einfach" : (recipe.difficulty == 1) ? "Normal" : "Schwer"
			
			for(var ingredient of recipe.ingredients) {
				if(ingredient.name === "fig") console.log("ID", recipe.id)
				//if(ingredient.category === "berry") console.log("ID", recipe.id)
			}
			//console.log("ID", recipe)
			
			this.recipes.push(recipe);
			
			let excelRowToSave = [
				{"attr": i, "width": 5},
				{"attr": recipe.id, "width": 10},
				{"attr": recipe.url, "width": 25},
				{"attr": recipe.title.de, "width":20}, 
				{"attr":recipe.title.en, "width":20},
				{"attr": this.translate.instant(recipe.category.toUpperCase()), "width": 15}, 
				{"attr":recipe.duration_prep, "width": 5},
				{"attr":recipe.duration_cook, "width": 5},
				{"attr":recipe.duration_rest, "width": 5},
				{"attr":recipe.duration_total, "width": 5}, 
				{"attr":recipe.portions, "width": 5},
				{"attr":recipe.difficulty, "width": 10}, 
				{"attr":recipe.vegetarian ? "Ja" : "Nein", "width": 5},
				{"attr":recipe.vegan ? "Ja" : "Nein", "width": 5},
				{"attr":recipe.description.de, "width":40},
				{"attr":recipe.description.en, "width":40}, 
				{"ingredients":recipe.ingredients}
			];
			
			this.recipeTable.appendChild(this.addTableRow(excelRowToSave))
			i++;
			 		
			//Contains all generated labels for the panels
			/*let excelRowToSave = [ingredient.name.de, ingredient.name.en, ingredient.plural.de, ingredient.plural.en,
				(ingredient.defaultStoreroom) ? "Ja" : "Nein", ingredient.icon || ingredient.name.en.toLowerCase(),
				this.createUnitPanel(ingredient, "gram"), this.createUnitPanel(ingredient, "milliliter"), 
				this.createUnitPanel(ingredient, "piece_small"),  this.createUnitPanel(ingredient, "piece"),
				this.createUnitPanel(ingredient, "piece_big"), this.createUnitPanel(ingredient, "mug"),
				this.createUnitPanel(ingredient, "can"), this.createUnitPanel(ingredient, "tablespoon"), 
				this.createUnitPanel(ingredient, "teaspoon"), this.createUnitPanel(ingredient, "knifetip"), 
				this.createUnitPanel(ingredient, "slice"), this.createUnitPanel(ingredient, "bunch"),
				this.createUnitPanel(ingredient, "stalk"), this.createUnitPanel(ingredient, "some")];
			
			env.tableData.push(excelRowToSave);
		
			
			
		}
		
		var buffer = xlsx.build([{name: "Ingredients", data: env.tableData}]); 
		fs.writeFileSync("C:/Users/Gerrit/Desktop/Crossplatform-Projects/Electron/rescufood_helper/Ingredients.xlsx", buffer)*/
		}); 
	}
	
	
	addTableRow(recipeRow): any {
		
		let env = this;
		let tr = document.createElement("tr");

		
			for(var columnLabel of recipeRow) {				
				if(!columnLabel.ingredients) {
					let th = document.createElement("td");
					th.style.width = columnLabel.width+"vw";
					
					let p = document.createElement("p");
					
					p.className = "recipe_col_panel";
					p.style.width = columnLabel.width+"vw";
					p.style.whiteSpace = "pre-wrap";
					p.style.fontSize = "1.5vh";
					p.style.padding = "0 1vw";
					p.style.maxHeight = "5vh";
 
					p.innerHTML = (columnLabel.attr !== undefined) ? columnLabel.attr : "";
					th.appendChild(p);
					
					tr.appendChild(th);
				} else {  	
					columnLabel.ingredients = Object.values(columnLabel.ingredients).sort((a, b) => {
 
						var keyA = a['order'], keyB = b['order'];
						  
						if (keyA < keyB) return -1;
						if (keyA > keyB) return 1;
						return 0;
					});
					
					for(var ingredient of columnLabel.ingredients) {	
					
						let th = document.createElement("td");
						th.style.width = "30vw";
						th.style.display = "flex";
						th.style.flexDirection = "column";
						
						let p_name = document.createElement("p"); 
						p_name.className = "recipe_col_panel_small"; 
						
						let p_val = document.createElement("p");
						p_val.className = "recipe_col_panel_small"; 
   				
						var ingre = this.ingredientsFromExcel.filter((excelIng) => { 	
							var ingredient_name = excelIng[1].split(",")[0].toLowerCase();	//take first english name of an excel ingredient
							if (ingredient_name === ingredient.name && excelIng[0][0].split(",")[0]) {
								return excelIng[0].split(",")[0];
							}
						});
						
						var german_p = ingre[0][0].split(",")[0]
						var category_p = (ingredient.category) ? ", (Kategorie: " + ingredient.category + ")," : ",";
						p_name.innerHTML = "<b>" + german_p +"</b>"+ category_p;
						
						var unit_p = "Einheit: "+this.translate.instant(ingredient.unit.toUpperCase());
						var value_p = ", Wert: "+ingredient.value;
						p_val.innerHTML =  unit_p + value_p;
						
						th.appendChild(p_name);
						th.appendChild(p_val);
						
						tr.appendChild(th);
					}	
				}
			}	 
		
		return tr;
	}
  }