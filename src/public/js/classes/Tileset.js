function Tileset(tilesetName, tileWidth, tileHeight) {
	var that = this;
	this.image = new Image();
	this.image.onload = function () {
		if (!this.complete)
			throw "Error loading \"" + tilesetName + "\" tileset resource";
		// Largeur du tileset en tiles
		that.largeur = this.width / tileWidth;
	}
	this.image.src = "tilesets/" + tilesetName;
	
	// Méthode de dessin du tile numéro "numero" dans le contexte 2D "context" aux coordonnées x et y
	this.dessinerTile = function(numero, context, xDestination, yDestination) {
		var xSourceEnTiles = numero % this.largeur;
		if(xSourceEnTiles == 0) xSourceEnTiles = this.largeur;
		var ySourceEnTiles = Math.ceil(numero / this.largeur);
		var xSource = (xSourceEnTiles - 1) * tileWidth;
		var ySource = (ySourceEnTiles - 1) * tileHeight;
		context.drawImage(this.image, xSource, ySource, tileWidth, 32, xDestination, yDestination, tileWidth, tileHeight);
	}
}