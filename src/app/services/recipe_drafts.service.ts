import { Injectable, inject } from '@angular/core';   
import { Firestore, collection, collectionSnapshots, doc, setDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 

@Injectable({
  providedIn: 'root'
})
export class RecipeDraftsService { 

	recipeDrafts$: Observable<any[]>;
	recipeDraftsValues$: Observable<any>;
	
	private firestore: Firestore = inject(Firestore); // inject Cloud Firestore

	constructor() {
		this.loadRecipeDraftsFromFirebase();  
	}
	
	loadRecipeDraftsFromFirebase() {
		const recipeDraftsCollection = collection(this.firestore, 'recipe_drafts');
		this.recipeDrafts$ = collectionSnapshots(recipeDraftsCollection).pipe(
			map(actions => {
				var recipeDrafts = actions.map(a => {
					var recipeDraftObj = a.data();
					recipeDraftObj.id = a.id; 
					return recipeDraftObj;
				});
				
				console.log("recipeDrafts",recipeDrafts);
				
				return recipeDrafts;
			})
		); 
	} 
	
	getRecipeDrafts(): Observable<any> {
		return this.recipeDrafts$;
	}   
	
	getRecipeDraftById(id: string) {
		return this.getRecipeDrafts().pipe(
			map(drafts => drafts.find((draft) => { 
			
				if(!draft.title.de) draft.title.de = "";
				if(!draft.title.en) draft.title.en = "";
				if(!draft.description.de) draft.title.de = "";
				if(!draft.description.en) draft.title.en = ""; 
			
				return draft.id === id;
			}))
		);  
	}
}
