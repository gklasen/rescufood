import { Component, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import xlsx from 'node-xlsx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collection, CollectionReference, collectionSnapshots, doc, setDoc  } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as fs from 'fs-extra';
import { app }  from '@electron/remote';


import { IngredientsService } from '../../services/ingredients.service';

var basepath = app.getAppPath();

@Component({
  selector: 'app-ingredient-insertion',
  templateUrl: './ingredient-insertion.component.html',
  styleUrls: ['./ingredient-insertion.component.scss']
})
export class IngredientInsertionComponent implements AfterViewInit  {

	private ingredientCollection: CollectionReference<any>;
	private units = [];
	tableData = [[ 
		"Namen (de)",		"Namen (en)",		
		"Im Lager",			"Ignoriert",	"Iconname",			"Category",
		"Einheit: Gramm", 		"Einheit: Milliliter", 
		"Einheit: kl. Stück",			"Einheit: Stück",		"Einheit: gr. Stück",		"Einheit: Tasse",		
		"Einheit: Becher", 	"Einheit: Dose", "Einheit: gr. Dose", "Einheit: Packung", "Einheit: Beutel","Einheit: Glas",	"Einheit: Esslöffel",		
		"Einheit: Teelöffel",	"Einheit: Messerspritze",	"Einheit: Scheibe",		
		"Einheit: Bund", "Einheit: Zweig", "Einheit: Blatt",	"Einheit: Handvoll",
		"Einheit: Würfel","Einheit: Zehe","Einheit: Tropfen", "Einheit: Rolle",			"Einheit: etwas"
	]];
	
	input_names_de: any;
	input_names_en: any;
	input_in_storeroom: any;
	input_in_ignorelist: any;
	input_iconname: any;
	input_category: any;
	input_unit_gram_val: any;
	input_unit_gram_fac: any;
	input_unit_gram_sta: any;
	input_unit_milliliter_val: any;
	input_unit_milliliter_fac: any;
	input_unit_milliliter_sta: any;
	input_unit_small_piece_val: any;
	input_unit_small_piece_fac: any;
	input_unit_small_piece_sta: any;
	input_unit_piece_val: any;
	input_unit_piece_fac: any;
	input_unit_piece_sta: any;
	input_unit_big_piece_val: any;
	input_unit_big_piece_fac: any;
	input_unit_big_piece_sta: any;
	input_unit_mug_val: any;
	input_unit_mug_fac: any; 
	input_unit_mug_sta: any;
	input_unit_can_val: any;
	input_unit_can_fac: any;
	input_unit_can_sta: any;
	input_unit_cup_val: any;
	input_unit_cup_fac: any;
	input_unit_cup_sta: any;
	input_unit_big_can_val: any;
	input_unit_big_can_fac: any;
	input_unit_big_can_sta: any;
	input_unit_package_val: any;
	input_unit_package_fac: any;
	input_unit_package_sta: any;
	input_unit_bag_val: any;
	input_unit_bag_fac: any;
	input_unit_bag_sta: any;
	input_unit_glass_val: any;
	input_unit_glass_fac: any;
	input_unit_glass_sta: any;
	input_unit_tablespoon_val: any;
	input_unit_tablespoon_fac: any;
	input_unit_tablespoon_sta: any;
	input_unit_teaspoon_val: any;
	input_unit_teaspoon_fac: any;
	input_unit_teaspoon_sta: any;
	input_unit_knifetip_val: any;
	input_unit_knifetip_fac: any;
	input_unit_knifetip_sta: any;
	input_unit_slice_val: any;
	input_unit_slice_fac: any;
	input_unit_slice_sta: any;
	input_unit_bunch_val: any;
	input_unit_bunch_fac: any;
	input_unit_bunch_sta: any;
	input_unit_stalk_val: any;
	input_unit_stalk_fac: any;
	input_unit_stalk_sta: any;
	input_unit_leaf_val: any;
	input_unit_leaf_fac: any;
	input_unit_leaf_sta: any;
	input_unit_handful_val: any;
	input_unit_handful_fac: any;
	input_unit_handful_sta: any;
	input_unit_cube_val: any;
	input_unit_cube_fac: any;
	input_unit_cube_sta: any;
	input_unit_clove_val: any;
	input_unit_clove_fac: any;
	input_unit_clove_sta: any;
	input_unit_drop_val: any;
	input_unit_drop_fac: any;
	input_unit_drop_sta: any;
	input_unit_roll_val: any;
	input_unit_roll_fac: any;
	input_unit_roll_sta: any;
	input_unit_some_val: any;
	input_unit_some_fac: any;
	input_unit_some_sta: any;
	ingredientTable: any;
	
	ingredientSubscription: any;
	
	ingredients: any = [];
	
	private firestore: Firestore = inject(Firestore); // inject Cloud Firestore

	constructor(private router: Router, public ingredientsService: IngredientsService) {}
	
	ngAfterViewInit(): void {
		
		this.input_names_de = (<HTMLInputElement>document.getElementById("input_names_de"));
		this.input_names_en = (<HTMLInputElement>document.getElementById("input_names_en"));
		this.input_in_storeroom = (<HTMLInputElement>document.getElementById("input_in_storeroom"));
		this.input_in_ignorelist = (<HTMLInputElement>document.getElementById("input_in_ignorelist"));
		this.input_iconname = (<HTMLInputElement>document.getElementById("input_iconname"));
		this.input_category = (<HTMLInputElement>document.getElementById("input_category"));
		this.input_unit_gram_val = (<HTMLInputElement>document.getElementById("input_unit_gram_val"))
		this.input_unit_gram_fac = (<HTMLInputElement>document.getElementById("input_unit_gram_fac"))
		this.input_unit_gram_sta = (<HTMLInputElement>document.getElementById("input_unit_gram_sta"))
		this.input_unit_milliliter_val = (<HTMLInputElement>document.getElementById("input_unit_milliliter_val"))
		this.input_unit_milliliter_fac = (<HTMLInputElement>document.getElementById("input_unit_milliliter_fac"))
		this.input_unit_milliliter_sta = (<HTMLInputElement>document.getElementById("input_unit_milliliter_sta"))
		this.input_unit_small_piece_val = (<HTMLInputElement>document.getElementById("input_unit_small_piece_val"))
		this.input_unit_small_piece_fac = (<HTMLInputElement>document.getElementById("input_unit_small_piece_fac"))
		this.input_unit_small_piece_sta = (<HTMLInputElement>document.getElementById("input_unit_small_piece_sta"))
		this.input_unit_piece_val = (<HTMLInputElement>document.getElementById("input_unit_piece_val"))
		this.input_unit_piece_fac = (<HTMLInputElement>document.getElementById("input_unit_piece_fac"))
		this.input_unit_piece_sta = (<HTMLInputElement>document.getElementById("input_unit_piece_sta"))
		this.input_unit_big_piece_val = (<HTMLInputElement>document.getElementById("input_unit_big_piece_val"))
		this.input_unit_big_piece_fac = (<HTMLInputElement>document.getElementById("input_unit_big_piece_fac"))
		this.input_unit_big_piece_sta = (<HTMLInputElement>document.getElementById("input_unit_big_piece_sta"))
		this.input_unit_mug_val = (<HTMLInputElement>document.getElementById("input_unit_mug_val"))
		this.input_unit_mug_fac = (<HTMLInputElement>document.getElementById("input_unit_mug_fac"))
		this.input_unit_mug_sta = (<HTMLInputElement>document.getElementById("input_unit_mug_sta"))
		this.input_unit_cup_val = (<HTMLInputElement>document.getElementById("input_unit_cup_val"))
		this.input_unit_cup_fac = (<HTMLInputElement>document.getElementById("input_unit_cup_fac"))
		this.input_unit_cup_sta = (<HTMLInputElement>document.getElementById("input_unit_cup_sta"))
		this.input_unit_can_val = (<HTMLInputElement>document.getElementById("input_unit_can_val"))
		this.input_unit_can_fac = (<HTMLInputElement>document.getElementById("input_unit_can_fac"))
		this.input_unit_can_sta = (<HTMLInputElement>document.getElementById("input_unit_can_sta"))
		this.input_unit_big_can_val = (<HTMLInputElement>document.getElementById("input_unit_big_can_val"))
		this.input_unit_big_can_fac = (<HTMLInputElement>document.getElementById("input_unit_big_can_fac"))
		this.input_unit_big_can_sta = (<HTMLInputElement>document.getElementById("input_unit_big_can_sta"))
		this.input_unit_package_val = (<HTMLInputElement>document.getElementById("input_unit_package_val"))
		this.input_unit_package_fac = (<HTMLInputElement>document.getElementById("input_unit_package_fac"))
		this.input_unit_package_sta = (<HTMLInputElement>document.getElementById("input_unit_package_sta"))
		this.input_unit_bag_val = (<HTMLInputElement>document.getElementById("input_unit_bag_val"))
		this.input_unit_bag_fac = (<HTMLInputElement>document.getElementById("input_unit_bag_fac"))
		this.input_unit_bag_sta = (<HTMLInputElement>document.getElementById("input_unit_bag_sta"))
		this.input_unit_glass_val = (<HTMLInputElement>document.getElementById("input_unit_glass_val"))
		this.input_unit_glass_fac = (<HTMLInputElement>document.getElementById("input_unit_glass_fac"))
		this.input_unit_glass_sta = (<HTMLInputElement>document.getElementById("input_unit_glass_sta"))
		this.input_unit_tablespoon_val = (<HTMLInputElement>document.getElementById("input_unit_tablespoon_val"))
		this.input_unit_tablespoon_fac = (<HTMLInputElement>document.getElementById("input_unit_tablespoon_fac"))
		this.input_unit_tablespoon_sta = (<HTMLInputElement>document.getElementById("input_unit_tablespoon_sta"))
		this.input_unit_teaspoon_val = (<HTMLInputElement>document.getElementById("input_unit_teaspoon_val"))
		this.input_unit_teaspoon_fac = (<HTMLInputElement>document.getElementById("input_unit_teaspoon_fac"))
		this.input_unit_teaspoon_sta = (<HTMLInputElement>document.getElementById("input_unit_teaspoon_sta"))
		this.input_unit_knifetip_val = (<HTMLInputElement>document.getElementById("input_unit_knifetip_val"))
		this.input_unit_knifetip_fac = (<HTMLInputElement>document.getElementById("input_unit_knifetip_fac"))
		this.input_unit_knifetip_sta = (<HTMLInputElement>document.getElementById("input_unit_knifetip_sta"))
		this.input_unit_slice_val = (<HTMLInputElement>document.getElementById("input_unit_slice_val"))
		this.input_unit_slice_fac = (<HTMLInputElement>document.getElementById("input_unit_slice_fac"))
		this.input_unit_slice_sta = (<HTMLInputElement>document.getElementById("input_unit_slice_sta"))
		this.input_unit_bunch_val = (<HTMLInputElement>document.getElementById("input_unit_bunch_val"))
		this.input_unit_bunch_fac = (<HTMLInputElement>document.getElementById("input_unit_bunch_fac"))
		this.input_unit_bunch_sta = (<HTMLInputElement>document.getElementById("input_unit_bunch_sta"))
		this.input_unit_stalk_val = (<HTMLInputElement>document.getElementById("input_unit_stalk_val"))
		this.input_unit_stalk_fac = (<HTMLInputElement>document.getElementById("input_unit_stalk_fac"))
		this.input_unit_stalk_sta = (<HTMLInputElement>document.getElementById("input_unit_stalk_sta"))
		this.input_unit_leaf_val = (<HTMLInputElement>document.getElementById("input_unit_leaf_val"))
		this.input_unit_leaf_fac = (<HTMLInputElement>document.getElementById("input_unit_leaf_fac"))
		this.input_unit_leaf_sta = (<HTMLInputElement>document.getElementById("input_unit_leaf_sta"))
		this.input_unit_handful_val = (<HTMLInputElement>document.getElementById("input_unit_handful_val"))
		this.input_unit_handful_fac = (<HTMLInputElement>document.getElementById("input_unit_handful_fac"))
		this.input_unit_handful_sta = (<HTMLInputElement>document.getElementById("input_unit_handful_sta"))
		this.input_unit_cube_val = (<HTMLInputElement>document.getElementById("input_unit_cube_val"))
		this.input_unit_cube_fac = (<HTMLInputElement>document.getElementById("input_unit_cube_fac"))
		this.input_unit_cube_sta = (<HTMLInputElement>document.getElementById("input_unit_cube_sta"))
		this.input_unit_clove_val = (<HTMLInputElement>document.getElementById("input_unit_clove_val"))
		this.input_unit_clove_fac = (<HTMLInputElement>document.getElementById("input_unit_clove_fac"))
		this.input_unit_clove_sta = (<HTMLInputElement>document.getElementById("input_unit_clove_sta"))
		this.input_unit_drop_val = (<HTMLInputElement>document.getElementById("input_unit_drop_val"))
		this.input_unit_drop_fac = (<HTMLInputElement>document.getElementById("input_unit_drop_fac"))
		this.input_unit_drop_sta = (<HTMLInputElement>document.getElementById("input_unit_drop_sta"))
		this.input_unit_roll_val = (<HTMLInputElement>document.getElementById("input_unit_roll_val"))
		this.input_unit_roll_fac = (<HTMLInputElement>document.getElementById("input_unit_roll_fac"))
		this.input_unit_roll_sta = (<HTMLInputElement>document.getElementById("input_unit_roll_sta"))
		this.input_unit_some_val = (<HTMLInputElement>document.getElementById("input_unit_some_val"))
		this.input_unit_some_fac = (<HTMLInputElement>document.getElementById("input_unit_some_fac"))
		this.input_unit_some_sta = (<HTMLInputElement>document.getElementById("input_unit_some_sta"))
		this.ingredientTable = document.getElementById("ingredient_table");
		
		/*var ingredientsFromExcel = xlsx.parse("C:/Users/Gerrit/Desktop/Crossplatform-Projects/Electron/rescufood_helper/Ingredients.xlsx");
		ingredientsFromExcel = ingredientsFromExcel[0].data;
		ingredientsFromExcel.shift();
		
		console.log("CHILDREN", this.ingredientTable.childNodes)
		
		while (this.ingredientTable.childNodes.length > 2) {
			this.ingredientTable.removeChild(this.ingredientTable.lastChild);
		}
		
		console.log("CHILDREN", this.ingredientTable.childNodes)
		
		for(var ingredientRow of ingredientsFromExcel) {
			this.ingredientTable.appendChild(this.addTableRow(ingredientRow))
		}*/
		this.loadIngredientsFromFirebase();
	}
	
	goToRecipes() {
		this.router.navigate(['/recipe_insertion'], { state: { ingredients: this.ingredients } } );
	}
    
    goToRecipeDrafts() {
		this.router.navigate(['/recipe_drafts'], { state: { ingredients: this.ingredients } } );
	}
	
	goToOccurances() {
		this.router.navigate(['/occurances'], { state: { ingredients: this.ingredients } } );
	}
	
	loadIngredientsFromFirebase() {
		let env = this; 
		
		while (this.ingredientTable.childNodes.length > 2) {
			this.ingredientTable.removeChild(this.ingredientTable.lastChild);
		}  
		
		if(this.ingredientSubscription) this.ingredientSubscription.unsubscribe();
		
		this.ingredients = [];
		const ingredientsCollection = collection(this.firestore, 'ingredients');
		this.ingredientSubscription = collectionSnapshots(ingredientsCollection).pipe(
			map(actions => {
				return actions.map((val) => {
					const d: any = val.data();
					return d;
				})
			}) 
		).subscribe((ingredients) => {  
		
			this.ingredients = ingredients;
		
			for(var ingredient of ingredients) {
				
				if(ingredient.own_ingredient === undefined) {
					//Contains all generated labels for the panels
					let excelRowToSave = [ingredient.name ? ingredient.name.de : ingredient.names.de, ingredient.name ? ingredient.name.en : ingredient.names.en, 
						(ingredient.defaultStoreroom) ? "Ja" : "Nein",
						(ingredient.defaultIgnoreList) ? "Ja" : "Nein",
						ingredient.icon || ingredient.names.en[0].toLowerCase(),	ingredient.category || "",
						this.createUnitPanel(ingredient, "gram"), this.createUnitPanel(ingredient, "milliliter"), 
						this.createUnitPanel(ingredient, "piece_small"),  this.createUnitPanel(ingredient, "piece"),
						this.createUnitPanel(ingredient, "piece_big"), this.createUnitPanel(ingredient, "mug"),
						this.createUnitPanel(ingredient, "cup"),  this.createUnitPanel(ingredient, "can"),
						this.createUnitPanel(ingredient, "can_big"),					
						this.createUnitPanel(ingredient, "package"), this.createUnitPanel(ingredient, "bag"),
						this.createUnitPanel(ingredient, "glass"),  
						this.createUnitPanel(ingredient, "tablespoon"),	this.createUnitPanel(ingredient, "teaspoon"),
						this.createUnitPanel(ingredient, "knifetip"), this.createUnitPanel(ingredient, "slice"), 
						this.createUnitPanel(ingredient, "bunch"), this.createUnitPanel(ingredient, "stalk"), 
						this.createUnitPanel(ingredient, "leaf"), this.createUnitPanel(ingredient, "handful"),
						this.createUnitPanel(ingredient, "cube"), this.createUnitPanel(ingredient, "clove"), 
						this.createUnitPanel(ingredient, "drop"), this.createUnitPanel(ingredient, "roll"),
						this.createUnitPanel(ingredient, "some")];
					
					env.tableData.push(excelRowToSave);
				
					this.ingredientTable.appendChild(this.addTableRow(excelRowToSave))
				}
				console.log(ingredient) 
			}
			
			var dummy = xlsx.build([{name: "Ingredients", data: [[]], options: {} }]); 
			fs.writeFileSync(basepath+ "Ingredients.xlsx", dummy)
			
            const sheetOptions = {'!cols': [{wch: 6}, {wch: 7}, {wch: 10}, {wch: 20}]};
			var buffer = xlsx.build([{name: "Ingredients", data: env.tableData, options: sheetOptions }]); 
            
            console.log(buffer)
            
			fs.writeFileSync("Ingredients.xlsx", buffer)
		});
	}
	
	addTableRow(ingredientRow): any {
		
		let env = this;
		let tr = document.createElement("tr");
		ingredientRow.forEach((columnLabel, index) => {	
			let th = document.createElement("td"); 
			let p = document.createElement("p");
			p.className = "col_panel";
			p.innerHTML = columnLabel;
			th.appendChild(p);
			
			tr.appendChild(th);
		});
		
		var addUnitUpdateBtnListener = ((val_panel, fac_panel, sta_panel, panel) => {
			
			console.log("panel", panel);
			
			var valNr = parseFloat(panel.split(",")[0].replace(/\D/g,''));
			val_panel.value = Number.isNaN(valNr) ? "" : valNr;
			var facNr = parseFloat(panel.split(",")[1].replace(/\D/g,''))
			fac_panel.value = Number.isNaN(facNr) ? "" : facNr;
			sta_panel.checked = (panel.split(",")[2] === ", Standardwert") ? true : false;
		})
		
		let th_update = document.createElement("td"); 
		let button_update = document.createElement("button");
		//button_update.className = "col_panel"; 
		button_update.innerHTML = "Update"
		button_update.addEventListener("click", function(){  
		 
			env.input_names_de.value = ingredientRow[0];
			env.input_names_en.value = ingredientRow[1];
			env.input_in_storeroom.checked = (ingredientRow[2] == "Ja") ? true : false;
			env.input_in_ignorelist.checked = (ingredientRow[3] == "Ja") ? true : false;
			env.input_iconname.value  = ingredientRow[4]
			env.input_category.value = ingredientRow[5]
			
			addUnitUpdateBtnListener(env.input_unit_gram_val, env.input_unit_gram_fac, env.input_unit_gram_sta, ingredientRow[6] );
			addUnitUpdateBtnListener(env.input_unit_milliliter_val, env.input_unit_milliliter_fac, env.input_unit_milliliter_sta, ingredientRow[7]);
			addUnitUpdateBtnListener(env.input_unit_small_piece_val, env.input_unit_small_piece_fac, env.input_unit_small_piece_sta, ingredientRow[8]);
			addUnitUpdateBtnListener(env.input_unit_piece_val, env.input_unit_piece_fac, env.input_unit_piece_sta, ingredientRow[9]);
			addUnitUpdateBtnListener(env.input_unit_big_piece_val, env.input_unit_big_piece_fac, env.input_unit_big_piece_sta, ingredientRow[10]);
			addUnitUpdateBtnListener(env.input_unit_mug_val, env.input_unit_mug_fac, env.input_unit_mug_sta, ingredientRow[11]);
			addUnitUpdateBtnListener(env.input_unit_cup_val, env.input_unit_cup_fac, env.input_unit_cup_sta, ingredientRow[12]);
			addUnitUpdateBtnListener(env.input_unit_can_val, env.input_unit_can_fac, env.input_unit_can_sta, ingredientRow[13]);
			addUnitUpdateBtnListener(env.input_unit_big_can_val, env.input_unit_can_fac, env.input_unit_can_sta, ingredientRow[14]);
			addUnitUpdateBtnListener(env.input_unit_package_val, env.input_unit_package_fac, env.input_unit_package_sta, ingredientRow[15]);
			addUnitUpdateBtnListener(env.input_unit_bag_val, env.input_unit_bag_fac, env.input_unit_bag_sta, ingredientRow[16]);
			addUnitUpdateBtnListener(env.input_unit_glass_val, env.input_unit_glass_fac, env.input_unit_glass_sta, ingredientRow[17]);
			addUnitUpdateBtnListener(env.input_unit_tablespoon_val, env.input_unit_tablespoon_fac, env.input_unit_tablespoon_sta, ingredientRow[18]);
			addUnitUpdateBtnListener(env.input_unit_teaspoon_val, env.input_unit_teaspoon_fac, env.input_unit_teaspoon_sta, ingredientRow[19]);
			addUnitUpdateBtnListener(env.input_unit_knifetip_val, env.input_unit_knifetip_fac, env.input_unit_knifetip_sta, ingredientRow[20]);
			addUnitUpdateBtnListener(env.input_unit_slice_val, env.input_unit_slice_fac, env.input_unit_slice_sta, ingredientRow[21]);
			addUnitUpdateBtnListener(env.input_unit_bunch_val, env.input_unit_bunch_fac, env.input_unit_bunch_sta, ingredientRow[22]);
			addUnitUpdateBtnListener(env.input_unit_stalk_val, env.input_unit_stalk_fac, env.input_unit_stalk_sta, ingredientRow[23]);
			addUnitUpdateBtnListener(env.input_unit_leaf_val, env.input_unit_leaf_fac, env.input_unit_leaf_sta, ingredientRow[24]);			
			addUnitUpdateBtnListener(env.input_unit_handful_val, env.input_unit_handful_fac, env.input_unit_handful_sta, ingredientRow[25]); 
			addUnitUpdateBtnListener(env.input_unit_cube_val, env.input_unit_cube_fac, env.input_unit_cube_sta, ingredientRow[26]);
			addUnitUpdateBtnListener(env.input_unit_clove_val, env.input_unit_clove_fac, env.input_unit_clove_sta, ingredientRow[27]);		
			addUnitUpdateBtnListener(env.input_unit_drop_val, env.input_unit_drop_fac, env.input_unit_drop_sta, ingredientRow[28]);	
			addUnitUpdateBtnListener(env.input_unit_roll_val, env.input_unit_roll_fac, env.input_unit_roll_sta, ingredientRow[29]);				
			addUnitUpdateBtnListener(env.input_unit_some_val, env.input_unit_some_fac, env.input_unit_some_sta, ingredientRow[30]); 
		});		
		
		th_update.appendChild(button_update);
		tr.appendChild(th_update);
		
		return tr;
	}
 
	submitIngredientToFirebase() {
		let env = this;
		var checkIngredient = ((unitname, val_panel, fac_panel, sta_panel, dataobj) => {
			if(val_panel.value !== "") {
				dataobj['units'].push({
					"name": unitname,
					"value": parseFloat(val_panel.value)
				})
				
				if(fac_panel.value !== "") dataobj['units'][dataobj['units'].length-1]['factor'] = parseFloat(fac_panel.value);
				if(sta_panel.checked) dataobj['units'][dataobj['units'].length-1]['defaultUnit'] = true;
			}
		});
		
		var dataobj = {
			names: {
				en: this.input_names_en.value.split(","), 
				de: this.input_names_de.value.split(",")
			} ,
			units: [] 
		};
					
		if(this.input_in_storeroom.checked) dataobj['defaultStoreroom'] = true;
		if(this.input_in_ignorelist.checked) dataobj['defaultIgnoreList'] = true;
		
		if(this.input_iconname.value !== "") dataobj['icon'] = this.input_iconname.value;
		if(this.input_category.value !== "") dataobj['category'] = this.input_category.value;
				
		checkIngredient("gram", this.input_unit_gram_val, this.input_unit_gram_fac, this.input_unit_gram_sta, dataobj)
		checkIngredient("milliliter", this.input_unit_milliliter_val, this.input_unit_milliliter_fac, this.input_unit_milliliter_sta, dataobj)
		checkIngredient("piece_small", this.input_unit_small_piece_val, this.input_unit_small_piece_fac, this.input_unit_small_piece_sta, dataobj)
		checkIngredient("piece", this.input_unit_piece_val, this.input_unit_piece_fac, this.input_unit_piece_sta, dataobj)
		checkIngredient("piece_big", this.input_unit_big_piece_val, this.input_unit_big_piece_fac, this.input_unit_big_piece_sta, dataobj)
		checkIngredient("mug", this.input_unit_mug_val, this.input_unit_mug_fac, this.input_unit_mug_sta, dataobj)
		checkIngredient("cup", this.input_unit_cup_val, this.input_unit_cup_fac, this.input_unit_cup_sta, dataobj)
		checkIngredient("can", this.input_unit_can_val, this.input_unit_can_fac, this.input_unit_can_sta, dataobj)
		checkIngredient("can_big", this.input_unit_big_can_val, this.input_unit_big_can_fac, this.input_unit_big_can_sta, dataobj)
		checkIngredient("package", this.input_unit_package_val, this.input_unit_package_fac, this.input_unit_package_sta, dataobj)
		checkIngredient("bag", this.input_unit_bag_val, this.input_unit_bag_fac, this.input_unit_bag_sta, dataobj)
		checkIngredient("glass", this.input_unit_glass_val, this.input_unit_glass_fac, this.input_unit_glass_sta, dataobj)
		checkIngredient("tablespoon", this.input_unit_tablespoon_val, this.input_unit_tablespoon_fac, this.input_unit_tablespoon_sta, dataobj)
		checkIngredient("teaspoon", this.input_unit_teaspoon_val, this.input_unit_teaspoon_fac, this.input_unit_teaspoon_sta, dataobj)
		checkIngredient("knifetip", this.input_unit_knifetip_val, this.input_unit_knifetip_fac, this.input_unit_knifetip_sta, dataobj)
		checkIngredient("slice", this.input_unit_slice_val, this.input_unit_slice_fac, this.input_unit_slice_sta, dataobj)
		checkIngredient("bunch", this.input_unit_bunch_val, this.input_unit_bunch_fac, this.input_unit_bunch_sta, dataobj)
		checkIngredient("stalk", this.input_unit_stalk_val, this.input_unit_stalk_fac, this.input_unit_stalk_sta, dataobj)
		checkIngredient("leaf", this.input_unit_leaf_val, this.input_unit_leaf_fac, this.input_unit_leaf_sta, dataobj)
		checkIngredient("handful", this.input_unit_handful_val, this.input_unit_handful_fac, this.input_unit_handful_sta, dataobj)
		checkIngredient("cube", this.input_unit_cube_val, this.input_unit_cube_fac, this.input_unit_cube_sta, dataobj)
		checkIngredient("clove", this.input_unit_clove_val, this.input_unit_clove_fac, this.input_unit_clove_sta, dataobj)
		checkIngredient("drop", this.input_unit_drop_val, this.input_unit_drop_fac, this.input_unit_drop_sta, dataobj)
		checkIngredient("roll", this.input_unit_roll_val, this.input_unit_roll_fac, this.input_unit_roll_sta, dataobj)
		checkIngredient("some", this.input_unit_some_val, this.input_unit_some_fac, this.input_unit_some_sta, dataobj)
		
		
		console.log("names", dataobj['names'])
		const ingredientDoc = doc(this.firestore, 'ingredients/'+dataobj['names']['en'][0].toLowerCase());
		setDoc(ingredientDoc, dataobj).then(function() {
			console.log("Document successfully written!");
			env.input_names_de.value = "";
			env.input_names_en.value = "";
			(<HTMLInputElement>document.getElementById("input_in_storeroom")).checked = false;
			(<HTMLInputElement>document.getElementById("input_in_ignorelist")).checked = false;
			(<HTMLInputElement>document.getElementById("input_iconname")).value = "";
			(<HTMLInputElement>document.getElementById("input_category")).value = "";
			
			(<HTMLInputElement>document.getElementById("input_unit_gram_val")).value = "100";
			(<HTMLInputElement>document.getElementById("input_unit_gram_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_gram_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_milliliter_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_milliliter_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_milliliter_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_small_piece_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_small_piece_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_small_piece_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_piece_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_piece_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_piece_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_big_piece_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_big_piece_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_big_piece_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_mug_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_mug_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_mug_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_cup_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_cup_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_cup_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_can_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_can_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_can_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_big_can_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_big_can_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_big_can_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_package_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_package_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_package_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_bag_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_bag_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_bag_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_glass_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_glass_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_glass_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_tablespoon_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_tablespoon_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_tablespoon_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_teaspoon_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_teaspoon_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_teaspoon_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_knifetip_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_knifetip_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_knifetip_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_slice_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_slice_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_slice_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_bunch_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_bunch_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_bunch_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_stalk_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_stalk_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_stalk_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_leaf_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_leaf_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_leaf_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_handful_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_handful_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_handful_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_cube_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_cube_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_cube_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_clove_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_clove_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_clove_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_drop_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_drop_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_drop_sta")).checked = false;
			 
			(<HTMLInputElement>document.getElementById("input_unit_roll_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_roll_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_roll_sta")).checked = false;
			
			(<HTMLInputElement>document.getElementById("input_unit_some_val")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_some_fac")).value = "";
			(<HTMLInputElement>document.getElementById("input_unit_some_sta")).checked = false;
			
			env.loadIngredientsFromFirebase();
		}).catch(function(error) { 
			console.error("Error writing document: ", error);
		});
	}
	
	createUnitPanel(ingredient: any, unit_name: string) {
		let factor_info;
		let default_value;
		let unitToFind = ingredient.units.find((unit) => { return unit.name === unit_name});
		if(unitToFind !== undefined) {
			factor_info = unitToFind.factor ? ", Faktor "+unitToFind.factor: ", - " 
			default_value = unitToFind.defaultUnit ? ", Standardwert" : ", -" 
			return unitToFind ? unitToFind.value + " Einheit(en)" + factor_info + default_value : "-"
		} else {
			return "- , - , -"
		}
	}

}
  