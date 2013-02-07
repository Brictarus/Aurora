var DIRECTION = {
	"BAS"    : 0,
	"GAUCHE" : 1,
	"DROITE" : 2,
	"HAUT"   : 3
}
var DUREE_ANIMATION = 8;
var DUREE_DEPLACEMENT = 30;


function Personnage(url, x, y, direction) {
	var that = this;
	var tileSize = 32;
	this.etatAnimation = -1;

	this.x = x; // (en cases)
	this.y = y; // (en cases)
	
	this.h = 0; // hauteur (en pixels)
	this.w = 0; // largeur (en pixels)
	
	this.xPixels = this.x * tileSize;
	this.yPixels = this.y * tileSize;
	
	this.direction = direction;
	
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + url + "\".";
		
		// Taille du personnage
		that.w = this.width / 4;
		that.h = this.height / 4;
	}
	this.image.src = "sprites/" + url;
	
	this._calculerDecalage = function () {
		var decalage = { x : 0, y : 0 };
		if(this.etatAnimation >= 0) {			
			// Nombre de pixels restant à parcourir entre les deux cases
			var pixelsAParcourir = tileSize - (tileSize * (this.etatAnimation / DUREE_DEPLACEMENT));
			
			// À partir de ce nombre, on définit le décalage en x et y.
			// NOTE : Si vous connaissez une manière plus élégante que ces quatre conditions, je suis preneur
			if(this.direction == DIRECTION.HAUT) {
				decalage.y = pixelsAParcourir;
			} else if(this.direction == DIRECTION.BAS) {
				decalage.y = -pixelsAParcourir;
			} else if(this.direction == DIRECTION.GAUCHE) {
				decalage.x = pixelsAParcourir;
			} else if(this.direction == DIRECTION.DROITE) {
				decalage.x = -pixelsAParcourir;
			}
		}
		return decalage;
	}
	
	this.draw = function(context, map, camera) {
		var frame = 0; // Numéro de l'image à prendre pour l'animation
		var decalageX = 0, decalageY = 0; // Décalage à appliquer à la position du personnage
		if(this.etatAnimation >= DUREE_DEPLACEMENT) {
			// Si le déplacement a atteint ou dépassé le temps nécessaire pour s'effectuer, on le termine
			this.etatAnimation = -1;
		} else if(this.etatAnimation >= 0) {
			// On calcule l'image (frame) de l'animation à afficher
			frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
			if(frame > 3) {
				frame %= 4;
			}
			
			var decalage = this._calculerDecalage();
			decalageX = decalage.x;
			decalageY = decalage.y;
			
			this.etatAnimation++;
		}
		
		/*
		 * Si aucune des deux conditions n'est vraie, c'est qu'on est immobile, 
		 * donc il nous suffit de garder les valeurs 0 pour les variables 
		 * frame, decalageX et decalageY
		 */
		
		this.xPixels = (this.x * tileSize) - (this.w / 2) + 16 + decalageX;
		this.yPixels = (this.y * tileSize) - this.h + 24 + decalageY;
		
		var destX = this.xPixels - camera.xScroll;
		var destY = this.yPixels - camera.yScroll;
		
		context.drawImage(
			this.image, 
			this.w * frame, this.direction * this.h, // Point d'origine du rectangle source à prendre dans notre image
			this.w, this.h, // Taille du rectangle source (c'est la taille du personnage)
			// Point de destination (dépend de la taille du personnage)
			destX, destY,
			this.w, this.h // Taille du rectangle destination (c'est la taille du personnage)
		);
		// tracé de la boite de collision du personnage
		if (__debug) {
			context.strokeStyle = __debugDrawingColor2;
			context.strokeRect(destX, destY, this.w, this.h);
		}
	}
	
	this.getCoordonneesAdjacentes = function(direction)  {
		var coord = {'x' : this.x, 'y' : this.y};
		switch(direction) {
			case DIRECTION.BAS : 
				coord.y++;
				break;
			case DIRECTION.GAUCHE : 
				coord.x--;
				break;
			case DIRECTION.DROITE : 
				coord.x++;
				break;
			case DIRECTION.HAUT : 
				coord.y--;
				break;
		}
		return coord;
	}
	
	this.getBarycenterPosition = function() {
		var decalage = this._calculerDecalage();
		var xBar = this.x * tileSize + this.w / 2 + decalage.x;
		var yBar = this.y * tileSize + this.h / 2 - 24 + decalage.y;
		return {
			x : xBar,
			y: yBar
		};
	}
		
	this.deplacer = function(direction, map) {
		// On ne peut pas se déplacer si un mouvement est déjà en cours !
		if(this.etatAnimation >= 0) {
			return false;
		}
		
		// On change la direction du personnage
		this.direction = direction;
			
		// On vérifie que la case demandée est bien située dans la carte
		var prochaineCase = this.getCoordonneesAdjacentes(direction);
		if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()) {
			// On retourne un booléen indiquant que le déplacement ne s'est pas fait, 
			// Ça ne coute pas cher et ca peut toujours servir
			return false;
		}
			
		// On commence l'animation
		this.etatAnimation = 0;
		
		// On effectue le déplacement
		this.x = prochaineCase.x;
		this.y = prochaineCase.y;
		
		return true;
	},

	this.update = function(keyboard, map) {
		if (keyboard) {
			//console.log('keyboard exists');
			if (keyboard.isPressed('up')) {
	            this.deplacer(DIRECTION.HAUT, map);
	        }
	        else if (keyboard.isPressed('down')) {
	            this.deplacer(DIRECTION.BAS, map);
	        }
	        else if (keyboard.isPressed('left')) {
	            this.deplacer(DIRECTION.GAUCHE, map);
	        }
	        else if (keyboard.isPressed('right')) {
	            this.deplacer(DIRECTION.DROITE, map);
	        }
    	}
	}

}
