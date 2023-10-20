import { Component, AfterViewInit, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import xlsx from 'node-xlsx';
import { Firestore, collection, CollectionReference, addDoc, doc, getDocs, deleteDoc } from '@angular/fire/firestore';
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
import { Observable, Subject, map } from 'rxjs';  
import { AlertModule } from '@full-fledged/alerts';
 
@Component({
  selector: 'app-recipe-drafts',
  templateUrl: './recipe-drafts.component.html',
  styleUrls: ['./recipe-drafts.component.scss']
})
export class RecipeDraftsComponent implements AfterViewInit  { 

	private ingredientCollection: CollectionReference<any>;
	ingredientsFromExcel: any;

    recipe_id_draft: any;
	input_url_draft: any; 
    input_author_name_draft: any;
    input_author_email_draft: any;    
	input_title_de_draft: any;    
	input_title_en_draft: any;
    input_category_draft: any;    
    
    input_duration_prep_draft: any;
    input_duration_cook_draft: any;
	input_duration_rest_draft: any;
	input_duration_total_draft: any;
    
    input_portions_draft: any;
    input_difficulty_draft: any; 
	input_vegetarian_draft: any;
	input_vegan_draft: any;
    
	input_description_de_draft: any;
	input_description_en_draft: any;

	recipeTable: any;
	
	urls = [];
	recipes = [];
	ingredients = [];
	
	private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
	
	constructor(private router: Router, public zone: NgZone,
		public translate: TranslateService, public http: HttpClient, public alertService: AlertService) {
		this.ingredients = this.router.getCurrentNavigation().extras.state.ingredients;
         
	}
		
		
	async parseURL() {
		
	}
	
	translation() {
		let env = this;
        let lang_to_translate_to = (env.input_title_de_draft.value !== "") ? "en" : "de";
        let title_to_translate = (env.input_title_de_draft.value !== "") ? env.input_title_de_draft.value : env.input_title_en_draft.value;
        let description_to_translate = (env.input_description_de_draft.value !== "") ? env.input_description_de_draft.value : env.input_description_en_draft.value;
        
        console.log("as", env.input_title_de_draft.value, env.input_description_de_draft)
        
		googleTranslation.translate(title_to_translate + "-----"+ description_to_translate , lang_to_translate_to).then((translation: string) => { 
			console.log(translation, "as")
			var parts = translation[0].toString().split("-----");
            if(lang_to_translate_to === "de") {
                env.input_title_de_draft.value = parts[0].trim(); 
                env.input_description_de_draft.value = parts[1].trim(); 
            } else {
                env.input_title_en_draft.value = parts[0].trim(); 
                env.input_description_en_draft.value = parts[1].trim(); 
            }
			
            this.textAreaAdjust("input_description_de_draft");
			this.textAreaAdjust("input_description_en_draft");
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
		
        this.recipe_id_draft = (<HTMLInputElement>document.getElementById("recipe_id_draft"));
		this.input_url_draft = (<HTMLInputElement>document.getElementById("input_url_draft"));
        this.input_author_name_draft = (<HTMLInputElement>document.getElementById("input_author_name_draft"))
        this.input_author_email_draft = (<HTMLInputElement>document.getElementById("input_author_email_draft"))
		this.input_title_de_draft = (<HTMLInputElement>document.getElementById("input_title_de_draft"))
		this.input_title_en_draft = (<HTMLInputElement>document.getElementById("input_title_en_draft")) 
		this.input_category_draft = (<HTMLSelectElement>document.getElementById("input_recipe_category_draft"))
        this.input_duration_prep_draft = (<HTMLInputElement>document.getElementById("input_duration_prep_draft"))
        this.input_duration_cook_draft = (<HTMLInputElement>document.getElementById("input_duration_cook_draft")) 
		this.input_duration_rest_draft = (<HTMLInputElement>document.getElementById("input_duration_rest_draft"));
        this.input_duration_total_draft = document.getElementById("input_duration_total_draft");
        
		this.input_description_de_draft = (<HTMLTextAreaElement>document.getElementById("input_description_de_draft"))
		this.input_description_en_draft = (<HTMLTextAreaElement>document.getElementById("input_description_en_draft"))
		this.input_portions_draft = (<HTMLInputElement>document.getElementById("input_portions_draft"))
		this.input_difficulty_draft = (<HTMLSelectElement>document.getElementById("input_difficulty_draft"));
        
		this.input_vegetarian_draft = (<HTMLInputElement>document.getElementById("input_vegetarian_draft")); 
		this.input_vegan_draft = (<HTMLInputElement>document.getElementById("input_vegan_draft"));
		
		this.recipeTable =  document.getElementById("recipe_table");
		
        
        
		this.ingredientsFromExcel = [];
         
		this.ingredientsFromExcel = xlsx.parse(basepath+"/Ingredients.xlsx");
        
        //this.ingredientsFromExcel = xlsx.parse("C:/Users/klasen/Desktop/Ascora/Crossplatform-Projects/Electron/rescufood_helper/Ingredients.xlsx");
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
		
    //index: 0 = de, 1 = en;
	matchIngredients(input, index) {
		var matches = this.ingredientsFromExcel.filter((ingredient) => {
			var ingredient_name = ingredient[index].split(",")[0].toLowerCase();
            
            //console.log("autoCompleteResult",ingredient_name, input);
            
			if (ingredient_name.toLowerCase().indexOf(input) > -1) { 
				return ingredient;
			}
		});
		
		if(matches.length == 0) {
			matches = this.ingredientsFromExcel.filter((ingredient) => {
				var ingredient_name = ingredient[index].split(",")[0].toLowerCase();
				if (input.indexOf(ingredient_name) > -1) {
					return ingredient;
				}
			});
		}
				
		for(var matched_ingredient of matches) {
			var ingredient_name = matched_ingredient[index].split(",")[0].toLowerCase();
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
				var autoCompleteResult = this.matchIngredients(event.target.value.toLowerCase(), 0);  
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
		if(this.input_duration_prep_draft.value !== "") total += parseInt(this.input_duration_prep_draft.value);
		if(this.input_duration_cook_draft.value !== "") total += parseInt(this.input_duration_cook_draft.value);
		if(this.input_duration_rest_draft.value !== "") total += parseInt(this.input_duration_rest_draft.value);
		this.input_duration_total_draft.innerHTML = total.toString();
	}
 
	textAreaAdjust(elem_id) {
		var id; 
		if(id instanceof String) {
			id = elem_id
		} else {
			 id = (<HTMLElement>event.target).id
		}
		
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
		dataobj['title']['de'] = this.input_title_de_draft.value;
		dataobj['title']['en'] = this.input_title_en_draft.value
		dataobj['description']['de'] = this.input_description_de_draft.value;
		dataobj['description']['en'] = this.input_description_en_draft.value;
		dataobj['category'] = this.input_category_draft.value
		
		if(this.input_duration_prep_draft.value !== "") dataobj['duration_prep'] = parseInt(this.input_duration_prep_draft.value)
		if(this.input_duration_cook_draft.value !== "") dataobj['duration_cook'] = parseInt(this.input_duration_cook_draft.value)
		if(this.input_duration_rest_draft.value !== "") dataobj['duration_rest'] = parseInt(this.input_duration_rest_draft.value)
		dataobj['duration_total'] = parseInt(this.input_duration_total_draft.innerHTML)
		if(this.input_vegetarian_draft.checked) dataobj['vegetarian'] = true;
		if(this.input_vegan_draft.checked) dataobj['vegan'] = true;
		dataobj['portions'] = parseInt(this.input_portions_draft.value);
		dataobj['difficulty'] = parseInt(this.input_difficulty_draft.value);
        if(this.input_url_draft.length > 0) dataobj['url'] = this.input_url_draft; 
        dataobj['author'] = this.input_author_name_draft.value;
        dataobj['author_mail'] = this.input_author_email_draft.value;
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
            env.input_url_draft.value = "";
            env.input_author_name_draft.value = "";            
            env.input_author_email_draft.value = "";
			env.input_title_de_draft.value = ""; 
			env.input_title_en_draft.value = "";
            
			env.input_description_de_draft.value = "";
			env.input_description_en_draft.value = "";
			env.input_category_draft.value = "";
			
			env.input_duration_prep_draft.value = "";
			env.input_duration_cook_draft.value = "";
			env.input_duration_rest_draft.value = "";            
			env.input_duration_total_draft.innerHTML = "";
            env.input_portions_draft.value = "";
			env.input_difficulty_draft.value =  "0";
            
			env.input_vegetarian_draft.checked = false;
			env.input_vegan_draft.checked = false;
             
			
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
            
            await this.deleteSubmittedDraft().then(() => {
                this.loadRecipesFromFirebase()
            }).catch(function(e) {
                console.error("Error deleting document: ", e);
            });
			

		}).catch(function(error) {
			console.error("Error writing document: ", error);
		});
		
	}
	
    deleteSubmittedDraft() {
        let env = this;
        return new Promise((resolve, reject) => { 
            console.log("to delete", env.recipe_id_draft.innerHTML); 
			const draftDoc = doc(this.firestore, 'recipe_drafts/'+env.recipe_id_draft.innerHTML);  
			deleteDoc(draftDoc).then(() => {
                env.recipe_id_draft.innerHTML = "";
                resolve("success");
            }).catch((error) => {
                reject(error);
            });
        });
    }
    
	loadRecipesFromFirebase() {
		let env = this; 
		while (this.recipeTable.childNodes.length > 2) {
			this.recipeTable.removeChild(this.recipeTable.lastChild);
		}  
		
		const recipeCollection = collection(this.firestore, 'recipe_drafts'); 
		getDocs(recipeCollection).then((recipesSnap) => {
			var i = 1;
			env.urls = [];
			
			while (this.recipeTable.childNodes.length > 2) {
				this.recipeTable.removeChild(this.recipeTable.lastChild);
			}
			
			var firebase_recipes = recipesSnap.docs;
            var recipe_draft = firebase_recipes[0].data();
            recipe_draft.id = firebase_recipes[0].id;  
                 
            env.recipe_id_draft.innerHTML = recipe_draft.id;
            env.input_url_draft.value = (recipe_draft.url) ? recipe_draft.url : "";
            env.input_author_name_draft.value = (recipe_draft.author) ? recipe_draft.author : "";
            env.input_author_email_draft.value = (recipe_draft.author_mail) ? recipe_draft.author_mail : "";
            env.input_title_de_draft.value = (recipe_draft.title.de) ? recipe_draft.title.de : "";
            env.input_title_en_draft.value = (recipe_draft.title.en) ? recipe_draft.title.en : "";
            env.input_category_draft.value = recipe_draft.category;
            env.input_duration_prep_draft.value = (recipe_draft.duration_prep > 0) ? recipe_draft.duration_prep : "";
            env.input_duration_cook_draft.value = (recipe_draft.duration_cook > 0) ? recipe_draft.duration_cook : "";
            env.input_duration_rest_draft.value = (recipe_draft.duration_rest > 0) ? recipe_draft.duration_rest : "";
            env.input_portions_draft.value = recipe_draft.portions;
            env.input_difficulty_draft.value = recipe_draft.difficulty;
            env.input_vegetarian_draft.checked = (recipe_draft.vegetarian) ? recipe_draft.vegetarian : false;
            env.input_vegan_draft.checked = (recipe_draft.vegan) ? recipe_draft.vegan : false;
            env.input_description_de_draft.value = (recipe_draft.description.de) ? (recipe_draft.description.de) : "";
            env.input_description_en_draft.value = (recipe_draft.description.en) ? (recipe_draft.description.en) : "";
             
            
            env.totalDuration();
            env.translation();

            for(var panelNr = 1; panelNr <= recipe_draft.ingredients.length; panelNr++) {   

                var ingredient = recipe_draft.ingredients[panelNr-1];
                var autoCompleteResult = this.matchIngredients(ingredient.name.toLowerCase(), 1);  
                
                //console.log("autoCompleteResult",autoCompleteResult);
                
                if(autoCompleteResult && autoCompleteResult.length > 0) {
                    var btn = (<HTMLInputElement>document.getElementById("button_ingredient"+panelNr)); 
                    var input = (<HTMLInputElement>document.getElementById("input_ingredient"+panelNr)); 
                    var amount = (<HTMLInputElement>document.getElementById("amount_ingredient"+panelNr));
                    var unit = (<HTMLSelectElement>document.getElementById("select_ingredient_unit"+panelNr)) 
                    var optional = (<HTMLInputElement>document.getElementById("optional_ingredient"+panelNr))
                    
                    input.value = autoCompleteResult[0].split(",")[0];

                    btn.disabled = false;
                    btn.innerHTML = autoCompleteResult[0].split(",")[0];
                    btn.click();
                    
                    amount.value = ingredient.value; 
                    
                    unit.value = ingredient.unit;
                    if(unit.value === "some") { 
                        amount.value = "0";
                    } else if (unit.value === "optional") {
                        amount.disabled = true;
                        amount.value = "1";
                    }
                    
                    optional.checked = ingredient.optional;
                    
                    
                }
                
               // input.keydown();
            }

			this.recipes = [];
			
			firebase_recipes.forEach(async (recipeDoc, index) => {
				var recipe = recipeDoc.data();
				recipe.id = recipeDoc.id
				
				env.urls.push(recipe.url);
				
				recipe.difficulty = (recipe.difficulty == 0) ? "Einfach" : (recipe.difficulty == 1) ? "Normal" : "Schwer"
				
				
				this.recipes.push(recipe);
				
				let excelRowToSave = [
					{"attr": i, "width": 5},
					{"attr": recipe.id, "width": 10},
					{"attr": recipe.url, "width": 5},
                    {"attr": recipe.author, "width": 10},
                    {"attr": recipe.author_mail, "width": 15},
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
			});
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
                             
							if (ingredient_name === ingredient.name.toLowerCase()) {
								return excelIng[0].split(",")[0];
							}
						});
                        
                        //console.log(ingre)
						
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