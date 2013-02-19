var DUREE_ANIMATION = 100;
var DUREE_DEPLACEMENT = 4;


function Player(url, x, y, direction) {
	var that = this;
	var tileSize = 32;
	this.etatAnimation = -1;

	this.maxHP = 100;
	this.HP = 80;
	this.maxMP = 80;
	this.MP = 60;


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
			throw "Erreur de chargement du sprite nomm� \"" + url + "\".";
		
		// Taille du personnage
		that.w = this.width / 4;
		that.h = this.height / 4;
	}
	this.image.src = "sprites/" + url;
	
	this.getBoundingBox = function() {
		return {
			x : this.xPixels,
			y : this.yPixels,
			w : this.w,
			h : this.h
		};
	}

	this._calculerDecalage = function () {
		var decalage = { x : 0, y : 0 };
		if(this.etatAnimation >= 0) {
			console.log('this.etatAnimation = ' + this.etatAnimation);
			// Nombre de pixels restant � parcourir entre les deux cases
			var pixelsAParcourir = tileSize - (tileSize * (this.etatAnimation / DUREE_DEPLACEMENT));
			
			// � partir de ce nombre, on d�finit le d�calage en x et y.
			// NOTE : Si vous connaissez une mani�re plus �l�gante que ces quatre conditions, je suis preneur
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
	
	this.draw = function(context, camera) {
		var frame = 0; // Num�ro de l'image � prendre pour l'animation
		var decalageX = 0, decalageY = 0; // D�calage � appliquer � la position du personnage
		if(this.etatAnimation >= DUREE_DEPLACEMENT) {
			// Si le d�placement a atteint ou d�pass� le temps n�cessaire pour s'effectuer, on le termine
			this.etatAnimation = -1;
		} else if(this.etatAnimation >= 0) {
			// On calcule l'image (frame) de l'animation � afficher
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
			this.w * frame, this.direction * this.h, // Point d'origine du rectangle source � prendre dans notre image
			this.w, this.h, // Taille du rectangle source (c'est la taille du personnage)
			// Point de destination (d�pend de la taille du personnage)
			destX, destY,
			this.w, this.h // Taille du rectangle destination (c'est la taille du personnage)
		);
		// trac� de la boite de collision du personnage
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
		
	this.move = function(direction, map) {
		// On ne peut pas se d�placer si un mouvement est d�j� en cours !
		if(this.etatAnimation >= 0) {
			return false;
		}
		
		// On change la direction du personnage
		this.direction = direction;
			
		// On v�rifie que la case demand�e est bien situ�e dans la carte
		var prochaineCase = this.getCoordonneesAdjacentes(direction);
		if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getGridWidth() || prochaineCase.y >= map.getGridHeight()) {
			// On retourne un bool�en indiquant que le d�placement ne s'est pas fait, 
			// �a ne coute pas cher et ca peut toujours servir
			return false;
		}
			
		// On commence l'animation
		this.etatAnimation = 0;
		
		// On effectue le d�placement
		this.x = prochaineCase.x;
		this.y = prochaineCase.y;
		
		return true;
	},

	this.update = function(keyboard, map) {
		if (keyboard) {
			//console.log('keyboard exists');
			if (keyboard.isPressed('up')) {
	            this.move(DIRECTION.HAUT, map);
	        }
	        else if (keyboard.isPressed('down')) {
	            this.move(DIRECTION.BAS, map);
	        }
	        else if (keyboard.isPressed('left')) {
	            this.move(DIRECTION.GAUCHE, map);
	        }
	        else if (keyboard.isPressed('right')) {
	            this.move(DIRECTION.DROITE, map);
	        }
    	}
	}

}
