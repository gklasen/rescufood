import { Component, ChangeDetectorRef } from '@angular/core';
import { IngredientsService } from '../../../services/ingredients.service';
 
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { dialog } from '@electron/remote';
import * as path from 'path'

import { IconSetService } from '@coreui/icons-angular';
import { cilX, cilPlus, brandSet } from '@coreui/icons';

@Component({
  selector: 'app-ingredient_insertion',
  templateUrl: './ingredient_insertion.component.html',
  styleUrls: ['./ingredient_insertion.component.scss']
})
export class IngredientInsertionComponent {
	
	dummyIngredient; 
	ingredientIDs = [];
	dummyVariantTranslation = "";
	
	alertShown: boolean = false;
	alertText: string = "";
	
	constructor(
		public ingredientsService: IngredientsService, 
		private router: Router,
		public translate: TranslateService,
		public iconSet: IconSetService,
		public cdr: ChangeDetectorRef
	) {
		this.iconSet.icons = { cilX, cilPlus, ...brandSet }; 
		
		this.ingredientsService.getDummyIngredient().subscribe((dummyIngredient) => { 
			this.dummyIngredient = dummyIngredient;
		}); 
		
		this.ingredientsService.getIngredientIDs().subscribe((ids) => { 
			this.ingredientIDs = ids;
			console.log("ids", this.ingredientIDs)
		});  
		
		this.dummyVariantTranslation = translate.instant("INGREDIENTS.ENTRY")
	} 
	
	changeID(input_event: Event) {
		this.dummyIngredient.id = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges();
		console.log(this.dummyIngredient)
	}
	
	changeIcon() {
		dialog.showOpenDialog({
			defaultPath: path.join(__dirname, './assets/ingredients'),
			properties: ['openFile']
		}).then(result => {
			if(!result.canceled) {
				var chosenPath = result.filePaths[0];
				var pathChunks = chosenPath.split("\\")
				var iconName = pathChunks[pathChunks.length-1].replace(".png","");
				this.dummyIngredient.icon = iconName
				this.cdr.detectChanges();
			} 
		}).catch(err => {
			console.log(err)
		})
	}
	
	changeCategory(input_event: Event) {
		this.dummyIngredient.category = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges();
		console.log(this.dummyIngredient)
	}
	
	removeNameVariant(ingredient_name: string, language: string) {
		this.dummyIngredient.names[language] = this.dummyIngredient.names[language].filter((variant) => {
			return variant !== ingredient_name;
		});
		this.cdr.detectChanges();
		console.log(this.dummyIngredient)
	}
	
	changeNameVariant(old_ingredient_name: string, language: string, input_event: Event) {
		const new_ingredient_name = (input_event.target as HTMLInputElement).value;
		this.dummyIngredient.names[language][this.dummyIngredient.names[language].findIndex((name) => name === old_ingredient_name)] = new_ingredient_name;
		this.cdr.detectChanges(); 
	}
	
	addNameVariant(language: string) { 
		this.dummyIngredient.names[language].push(this.dummyVariantTranslation+ " "+(this.dummyIngredient.names[language].length+1));
		this.cdr.detectChanges();
	}
	
	selectDefaultUnit(ingredient_unit_name: string) {
		for(var unit of this.dummyIngredient.units) {
			if(unit.name === ingredient_unit_name) {
				unit.defaultUnit = true;
			} else {
				unit.defaultUnit = false;
			}
		}
		this.cdr.detectChanges();
		console.log(this.dummyIngredient)
	}
	
	updateIngredient() {
		 
		
		if(this.dummyIngredient.id.trim().length === 0) {
			this.alertText = this.translate.instant("INGREDIENTS.ALERTS.ID_NEEDED"); 
			this.alertShown = true;
		} else if(this.dummyIngredient.icon === "dummy") {
			this.alertText = this.translate.instant("INGREDIENTS.ALERTS.ICON_NEEDED");
			this.alertShown = true;
		} else if(this.dummyIngredient.names['de'].find(name => name.includes(this.translate.instant("INGREDIENTS.ENTRY"))) || 
			this.dummyIngredient.names['en'].find(name => name.includes(this.translate.instant("INGREDIENTS.ENTRY"))) ||
			this.dummyIngredient.names['de'].some(item => item.trim() === '') ||
			this.dummyIngredient.names['en'].some(item => item.trim() === '')) {
			this.alertText = this.translate.instant("INGREDIENTS.ALERTS.DEFAULT_VARIANT");
			this.alertShown = true;
		} else if(!this.dummyIngredient.units.some(unit => unit.value !== 0)){
			this.alertText = this.translate.instant("INGREDIENTS.ALERTS.NO_VALUES");
			this.alertShown = true;
		} else {
			this.alertText = "Keine Fehler";
			this.alertShown = false;
		}
		
		this.cdr.detectChanges();
		 
		
		if(!this.alertShown) {
			var objectCopy = JSON.parse(JSON.stringify(this.dummyIngredient));
			
			for(var index = objectCopy.units.length-1; index >= 0; index--) { 
				if(objectCopy.units[index].value == 0) {
					objectCopy.units.splice(index, 1);
				} else if(objectCopy.units[index].factor == 0) {
					delete objectCopy.units[index].factor; 
					delete objectCopy.units[index].defaultUnit; 
				} else if(objectCopy.units[index].defaultUnit == false) {
					delete objectCopy.units[index].defaultUnit;
				} 
			}
			
			if(!objectCopy.defaultStoreroom) delete objectCopy.defaultStoreroom;
			if(!objectCopy.defaultIgnoreList) delete objectCopy.defaultIgnoreList;
			if(!objectCopy.category) delete objectCopy.category; 
			
			objectCopy.id = objectCopy.id.trim();
			objectCopy.names['de'] = objectCopy.names['de'].map(name => name.trim());
			objectCopy.names['en'] = objectCopy.names['en'].map(name => name.trim());
			for(var unit of objectCopy.units) {
				delete unit.optional
			}
			
			console.log(objectCopy)
			
			this.ingredientsService.updateIngredient(objectCopy).then(() => {
				this.router.navigate(["/ingredients/ingredients_overview"]);
			}).catch((e) => {
				console.log(e);
			});
		} else {
			setTimeout(() => {
				this.alertShown = false;
				this.cdr.detectChanges();
			}, 2000);
		}
	}
}
