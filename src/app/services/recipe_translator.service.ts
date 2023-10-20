import { Injectable } from '@angular/core';    
const {Translate} = require('@google-cloud/translate').v2;

@Injectable({
  providedIn: 'root'
})
export class RecipeTranslatorService {  
 
	// Instantiates a client
	googleTranslation = new Translate({
		projectId: "foodpuzzle-2ee52", //eg my-project-0o0o0o0o'
		keyFilename: 'Foodpuzzle-f7c42f10314a.json' //eg my-project-0fwewexyz.json
	});
	
	separator: string = "-----";
 
	constructor() { 
	} 
	
	translate(title_de, description_de) {
		return new Promise((resolve, reject) => {
			this.googleTranslation.translate(title_de + " " + this.separator + " " + description_de , "en").then((translation: string) => {  
			
			
				var parts = translation[0].toString().split(this.separator); 
				console.log( translation[0].toString(), translation, parts);
			
				
				const title_en = parts[0].trim(); 
				const description_en = parts[1].trim();  
				resolve({title_en, description_en});
			}, (error) => {
				reject(error)
			});
		}); 
	}
	
}
