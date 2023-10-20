export class IngredientParser {
	static generateFirebaseID(): string  { 
		const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';		
		
		let result = ' ';
		const charactersLength = characters.length;
		for ( let i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}
	
	static prepareIngredients(ingredients) {
		var ingredientParts = [];
		//var parts = ingredients.split(" ");
		//console.log("needed ingredients",ingredients)
		//remove whitespace from start
		ingredients.forEach((ingredient, index) => {
			var parts = ingredient.split(" ");
			//console.log("needed parts",parts)
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
			if(parts[2] === "Karotte(n)") parts[2] = "Karotte";
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
			if(parts[2] === "Gemüsebrühepulver") parts[2] = "Gemüsebrühe";  
			if(parts[2] === "Kartoffel(n)") parts[2] = "Kartoffeln";  
			if(parts[2] === "Zwiebel(n)") parts[2] = "Zwiebeln";  
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
			if(parts[2] === "Paprikaschote(n)" && parts[3].includes("gelb")) parts[2] = "Gelbe Paprika";  
			if(parts[2] === "Paprikaschote(n)" && parts[3].includes("rot")) parts[2] = "Rote Paprika"; 
			if(parts[2] === "Paprikaschote(n)" && parts[3].includes("grün")) parts[2] = "Grüne Paprika";  
			if(parts[2] === "Bohnen" && parts[3].includes("grün")) parts[2] = "Grüne Bohnen";  
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
		 
			//console.log("corrected parts",parts)
		 
			while(parts.length > 3) {   
				if(parts[parts.length-1] === "optional") break;
				parts.pop();  
			}
			
			
			ingredientParts.push(parts);
		});
		
		
		//split shared ingredients
		
		
		return ingredientParts;
	}
}