import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'ingredientsort',
    pure: false
})
export class IngredientSortPipe implements PipeTransform {
	
	constructor(public translateService: TranslateService) {}
	
    transform(items: any): any {
        if (!items) {
            return;
        }

		items.sort((a, b) => {
			if(a.names[this.translateService.currentLang][0] > b.names[this.translateService.currentLang][0]) {
				return 1; 
			} else {
				return -1;
			}
		});
		
		return items;
    }
}