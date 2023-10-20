import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'recipesort',
    pure: false
})
export class RecipeSortPipe implements PipeTransform {
	
	constructor(public translateService: TranslateService) {}
	
    transform(items: any): any {
        if (!items) {
            return;
        }

		items.sort((a, b) => {
			if(a.title[this.translateService.currentLang] > b.title[this.translateService.currentLang]) {
				return 1; 
			} else {
				return -1;
			}
		});
		
		return items;
    }
}