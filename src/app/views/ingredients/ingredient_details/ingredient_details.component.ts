import { Component, ChangeDetectorRef } from '@angular/core';
import { IngredientsService } from '../../../services/ingredients.service';
 
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { dialog } from '@electron/remote';
import * as path from 'path'

import { IconSetService } from '@coreui/icons-angular';
import { cilX, cilPlus, brandSet } from '@coreui/icons';

@Component({
  selector: 'app-ingredient_details',
  templateUrl: './ingredient_details.component.html',
  styleUrls: ['./ingredient_details.component.scss']
})
export class IngredientDetailsComponent {
	
	selectedIngredient;
	chosenId;
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
		this.chosenId = this.router.url.split('/').pop().replace(/%20/g, " "); 
		this.ingredientsService.getIngredient(this.chosenId).subscribe((selectedIngredient) => { 
			console.log("SUB!!")
			this.selectedIngredient = selectedIngredient;  
		}); 
		this.dummyVariantTranslation = translate.instant("INGREDIENTS.ENTRY")
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
				this.selectedIngredient.icon = iconName
				this.cdr.detectChanges();
			} 
		}).catch(err => {
			console.log(err)
		})
	}
	
	changeCategory(input_event: Event) {
		this.selectedIngredient.category = (input_event.target as HTMLInputElement).value;
		this.cdr.detectChanges();
		console.log(this.selectedIngredient)
	}
	
	removeNameVariant(ingredient_name: string, language: string) {
		this.selectedIngredient.names[language] = this.selectedIngredient.names[language].filter((variant) => {
			return variant !== ingredient_name;
		});
		this.cdr.detectChanges();
		console.log(this.selectedIngredient)
	}
	
	changeNameVariant(old_ingredient_name: string, language: string, input_event: Event) {
		const new_ingredient_name = (input_event.target as HTMLInputElement).value;
		this.selectedIngredient.names[language][this.selectedIngredient.names[language].findIndex((name) => name === old_ingredient_name)] = new_ingredient_name;
		this.cdr.detectChanges(); 
	}
	
	addNameVariant(language: string) { 
		this.selectedIngredient.names[language].push(this.dummyVariantTranslation+ " "+(this.selectedIngredient.names[language].length+1));
		this.cdr.detectChanges();
	}
	
	selectDefaultUnit(ingredient_unit_name: string) {
		for(var unit of this.selectedIngredient.units) {
			if(unit.name === ingredient_unit_name) {
				unit.defaultUnit = true;
			} else {
				unit.defaultUnit = false;
			}
		}
		this.cdr.detectChanges();
		console.log(this.selectedIngredient)
	}
	
	async updateIngredient() {
		
		if(this.selectedIngredient.id.trim().length === 0) {
			this.alertText = this.translate.instant("INGREDIENTS.ALERTS.ID_NEEDED");
			this.alertShown = true;
		} else if(this.selectedIngredient.icon === "dummy") {
			this.alertText = this.translate.instant("INGREDIENTS.ALERTS.ICON_NEEDED");
			this.alertShown = true;
		} else if(this.selectedIngredient.names['de'].find(name => name.includes(this.translate.instant("INGREDIENTS.ENTRY"))) || 
			this.selectedIngredient.names['en'].find(name => name.includes(this.translate.instant("INGREDIENTS.ENTRY"))) ||
			this.selectedIngredient.names['de'].some(item => item.trim() === '') ||
			this.selectedIngredient.names['en'].some(item => item.trim() === '')) {
			this.alertText = this.translate.instant("INGREDIENTS.ALERTS.DEFAULT_VARIANT");
			this.alertShown = true;
		} else if(!this.selectedIngredient.units.some(unit => unit.value !== 0)){
			this.alertText = this.translate.instant("INGREDIENTS.ALERTS.NO_VALUES");
			this.alertShown = true;
		} else {
			this.alertText = "Keine Fehler";
			this.alertShown = false;
		}
		
		this.cdr.detectChanges(); 
		
		if(!this.alertShown) {
			
			var objectCopy = JSON.parse(JSON.stringify(this.selectedIngredient));
			
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
			
			if(!objectCopy.category) delete objectCopy.category;
			if(!objectCopy.defaultStoreroom) delete objectCopy.defaultStoreroom;
			if(!objectCopy.defaultIgnoreList) delete objectCopy.defaultIgnoreList; 
			
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
