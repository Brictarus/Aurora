var Map = BaseClass.extend({
    
    mustDrawMesh : true,

    personnages : [],

    terrain : null,

    tileWidth : null,

    tileHeight : null,

    mapHeight : null,
    mapWidth : null,

    tileset : null,

    initialize : function(mapName) {
    	
    	// Création de l'objet XmlHttpRequest
		var xhr = getXMLHttpRequest();

		// Chargement du fichier
		xhr.open("GET", './maps/' + mapName + '.json', false);
		xhr.send(null);
		if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
			throw new Error("Error while loading map \"" + mapName + "\" (code HTTP : " + xhr.status + ").");
		var mapJsonData = xhr.responseText;
		
		// Analyse des données
		var mapData = JSON.parse(mapJsonData);
		this.terrain = mapData.terrain;
		console.log('this.terrain set. height = ' + this.terrain.length);
		this.tileWidth = mapData.tileWidth;
		this.tileHeight = mapData.tileHeight;
		this.mapHeight = this.terrain.length;
		this.mapWidth = this.terrain[0].length;
		this.tileset = new Tileset(mapData.tileset, this.tileWidth, this.tileHeight);
    },

    getTileWidth : function() {
    	return this.tileWidth;
    },

    getTileHeight : function() {
    	return this.tileHeight;
    },
	
	// Pour récupérer la taille (en tiles) de la carte
	getGridHeight : function() {
		return this.mapHeight;
	},

	getAdjacentCellCoord : function(srcCoord, dir) {
		var destCoord = { x : srcCoord.x, y : srcCoord.y}
		switch(dir) {
			case direction.DOWN : 
				destCoord.y++;
				break;
			case direction.LEFT : 
				destCoord.x--;
				break;
			case direction.RIGHT : 
				destCoord.x++;
				break;
			case direction.UP : 
				destCoord.y--;
				break;
		}
		if (destCoord.x < 0 || destCoord.x >= this.mapWidth 
			|| destCoord.y < 0 || destCoord.y >= this.mapHeight) {
			return null;
		}
		return destCoord;
	},

	getGridWidth : function() {
		return this.mapWidth;
	},

	getHeight : function() {
		return this.mapHeight * this.tileHeight;
	},
	
	getWidth : function() {
		return this.mapWidth * this.tileWidth;
	},

	drawMap : function(context,cam) {
		var camSize = cam.getWindowSize();
		var minx = Math.floor(cam.xScroll / this.tileWidth);
		var miny = Math.floor(cam.yScroll / this.tileHeight);
		var maxx = Math.ceil((cam.xScroll + camSize.w) / this.tileWidth);
		var maxy = Math.ceil((cam.yScroll + camSize.h) / this.tileHeight);
		for(var i = miny; i < maxy ; i++) {
			var ligne = this.terrain[i];
			var y = i * 32 - cam.yScroll;
			for(var j = minx; j < maxx; j++) {
				var x = j * 32 - cam.xScroll;
				this.tileset.dessinerTile(ligne[j], context, x, y);
			}
		}
		
		if (this.mustDrawMesh)
		    this.drawMapMesh(context, minx, maxx, miny, maxy, cam);
		
		// Dessin des personnages
		for(var i = 0, l = this.personnages.length ; i < l ; i++) {
			this.personnages[i].dessinerPersonnage(context, this, cam);
		}
		
		if (__debug)
			cam.draw(context);
	},
	
	drawMapMesh : function(context, minx, maxx, miny, maxy, cam) {
		var strokeColor = __debugDrawingColor1;
		// tracé des lignes horizontales
		for(var y = miny; y < maxy; y++) {
			var xStart = minx * this.tileWidth - cam.xScroll;
			var xStop = maxx * this.tileWidth - cam.xScroll;
			var yPixels = y * this.tileHeight - cam.yScroll;
			context.strokeStyle = strokeColor;
			context.beginPath();
			context.moveTo(xStart, yPixels);
			context.lineTo(xStop, yPixels);
			context.stroke();
		}
		// tracé des lignes verticales
		for(var x = minx; x < maxx; x++) {
		    var yStart = miny * this.tileHeight - cam.yScroll;
		    var yStop = maxy * this.tileHeight - cam.yScroll;
		    var xPixels = x * this.tileWidth - cam.xScroll;
			context.strokeStyle = strokeColor;
			context.beginPath();
			context.moveTo(xPixels, yStart);
			context.lineTo(xPixels, yStop);
			context.stroke();
		}
	}
});
