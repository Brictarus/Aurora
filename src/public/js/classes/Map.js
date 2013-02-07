function Map(nom) {
    this.dessinQuadrillageMap = true;

	// Création de l'objet XmlHttpRequest
	var xhr = getXMLHttpRequest();

	// Chargement du fichier
	xhr.open("GET", './maps/' + nom + '.json', false);
	xhr.send(null);
	if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
		throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");
	var mapJsonData = xhr.responseText;
	// Analyse des données
	var mapData;
	if(JSON) 
		mapData = JSON.parse(mapJsonData);
	else
	    eval("mapData = " + mapJsonData);
	this.terrain = mapData.terrain;
	console.log('this.terrain set. height = ' + this.terrain.length);
	this.tileWidth = mapData.tileWidth;
	this.tileHeight = mapData.tileHeight;
	this.tileset = new Tileset(mapData.tileset, this.tileWidth, this.tileHeight);
	
	// Liste des personnages présents sur le terrain.
	this.personnages = new Array();
	
	// Pour ajouter un personnage
	this.addPersonnage = function(perso) {
		this.personnages.push(perso);
	}
	
	// Pour récupérer la taille (en tiles) de la carte
	this.getHauteur = function() {
		return this.terrain.length;
	}
	this.getLargeur = function() {
		return this.terrain[0].length;
	}
	
	this.dessinerMap = function(context,cam) {
		var camSize = cam.getWindowSize();
		var minx = Math.floor(cam.xScroll / this.tileWidth);
		var miny = Math.floor(cam.yScroll / this.tileHeight);
		var maxx = Math.ceil((cam.xScroll + camSize.width) / this.tileWidth);
		var maxy = Math.ceil((cam.yScroll + camSize.height) / this.tileHeight);
		for(var i = miny; i < maxy ; i++) {
			var ligne = this.terrain[i];
			var y = i * 32 - cam.yScroll;
			for(var j = minx; j < maxx; j++) {
				var x = j * 32 - cam.xScroll;
				this.tileset.dessinerTile(ligne[j], context, x, y);
			}
		}
		
		if (this.dessinQuadrillageMap || __debug)
		    this.dessinerQuadrillageMap(context, minx, maxx, miny, maxy, cam);
		
		// Dessin des personnages
		for(var i = 0, l = this.personnages.length ; i < l ; i++) {
			this.personnages[i].dessinerPersonnage(context, this, cam);
		}
		
		if (__debug)
			cam.draw(context);
	}
	
	this.dessinerQuadrillageMap = function(context, minx, maxx, miny, maxy, cam) {
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
}
