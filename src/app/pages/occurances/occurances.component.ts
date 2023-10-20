import { Component, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import xlsx from 'node-xlsx';
import { map } from 'rxjs/operators';
import {Observable} from "rxjs";
import { Firestore, collection, CollectionReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as fs from 'fs-extra';

import { TranslateService } from '@ngx-translate/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-occurances',
  templateUrl: './occurances.component.html',
  styleUrls: ['./occurances.component.scss']
})
export class OccurancesComponent implements AfterViewInit  {

	private ingredientCollection: CollectionReference<any>;
	nameOccurancesTable : any;
	categoryOccurancesTable : any;
	nameTableEntries: any = [];
	categoryTableEntries: any = [];
	recipes = [];
	ingredients = [];
	
	private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
	
	constructor(private router: Router,  
		public translate: TranslateService, public http: HttpClient) {
			this.recipes = this.router.getCurrentNavigation().extras.state.recipes;
			this.ingredients = this.router.getCurrentNavigation().extras.state.ingredients; 
		}
	
	ngAfterViewInit(): void {
		let env = this;
		this.nameOccurancesTable = document.getElementById("name_occurances_table");
		this.categoryOccurancesTable = document.getElementById("category_occurances_table");
		
		var nameMap = {};
		var categoryMap = {};
		var ingredient_occurances_total = 0;
		
		for(var recipe of this.recipes) {
			console.log(recipe)
			var ingredients_needed = recipe.ingredients.map(a => a.name);
			var categories_needed = recipe.ingredients.map(a => {
                if(a.category === "category") console.log("SSSS", recipe);
                return a.category
            });
			
			for(var ingredient_needed of ingredients_needed) {
				if(!nameMap[ingredient_needed]) nameMap[ingredient_needed] = 0
				nameMap[ingredient_needed]++
			} 
			
			for(var category_needed of categories_needed) {
				if(category_needed === undefined) category_needed = "keine";
				if(!categoryMap[category_needed]) categoryMap[category_needed] = 0
				categoryMap[category_needed]++
				ingredient_occurances_total++;
			} 
		}
		
		console.log("nameMap", nameMap)
		console.log("categoryMap", categoryMap)
		
		for (const [ingredient_name, occurance] of Object.entries(nameMap)) {
			console.log("ingredient_name", ingredient_name)
			var ingredientObj = this.ingredients.find((ingredient) => {  
				return ingredient.names.en[0].toLowerCase() === ingredient_name
			})
			
			env.nameTableEntries.push({ name: ingredientObj.names.de[0], occurances: occurance});	
		}
		
		for (const [category_name, occurance] of Object.entries(categoryMap)) {
			var ingredientObj = this.ingredients.find((ingredient) => { 
				
				if(ingredient.category === undefined) ingredient.category = "keine" 
				return ingredient.category.toLowerCase() === category_name;
			})
			
			console.log(ingredientObj, category_name, occurance)
			if(ingredientObj.category === undefined) ingredientObj.category = "keine";
			env.categoryTableEntries.push({ category: ingredientObj.category, occurances: occurance , relative: ( <number>occurance / ingredient_occurances_total * 100).toFixed(2) });
		}
		 
		env.nameTableEntries.sort((a, b) => {
			if(a.occurances < b.occurances) {
				return 1;
			} else if(a.occurances > b.occurances) {
				return -1;
			} else {
				if(a.name < b.name) {
					return 1;
				} else {
					return -1;
				}
			}
		});
		env.categoryTableEntries.sort((a, b) => {
			if(a.occurances < b.occurances) {
				return 1;
			} else if(a.occurances > b.occurances) {
				return -1;
			} else {
				if(a.category < b.category) {
					return 1;
				} else {
					return -1;
				}
			}
		});
		
		for(var entry of env.nameTableEntries) {
			env.nameOccurancesTable.appendChild(env.addTableRow(entry.name, entry.occurances, undefined))
		} 
		for(var entry of env.categoryTableEntries) {
			env.categoryOccurancesTable.appendChild(env.addTableRow(entry.category, entry.occurances, entry.relative))
		} 
	}
	
	addTableRow(name, occurances, relative) {
		let tr = document.createElement("tr");
		
		let th_name = document.createElement("td");
		let p_name = document.createElement("p");
 
		p_name.innerHTML = name;
		th_name.style.width = "24vw";
		th_name.appendChild(p_name);
		
		let th_amount = document.createElement("td");
		let p_amount = document.createElement("p");
		
		p_amount.innerHTML = (relative) ? occurances + " (" + relative + "%)" : occurances;
		th_amount.style.width = "24vw";
		th_amount.appendChild(p_amount);
		
		tr.appendChild(th_name);
		tr.appendChild(th_amount);
		
		return tr;
	}
}