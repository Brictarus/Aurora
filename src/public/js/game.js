var Game = function(config) {
	this.started = false;
	this.isStopped = false;
	this.currentTime = null;

	this.FPS = 60;
	this.tileSize = 32;
	this.lastTime = new Date();
	this.frameCount = 0;
    this.maxFPS = this.FPS;
    this.realFPS = 0;
    this.isDebugInfoVisible = true;

    this.camera = null;

	this.audioEngine = null;

	this.keyboard = config.keyboard;

	this.entities = [];
	this.map = null;

	this.canvas = config.canvas;
	this.context = (this.canvas && this.canvas.getContext) ? this.canvas.getContext("2d") : null;

	this.map = new Map("premiere");
	this.player = new Personnage("angel1.png", 7, 7, DIRECTION.BAS);
	this.entities.push(this.player);
	this.createCamera();
	this.camera.followObject(this.player);
}

Game.prototype.getWidth = function() {
    return this.canvas.width;
}

Game.prototype.getHeight = function() {
    return this.canvas.height;
}

Game.prototype.tick = function() {
    this.currentTime = new Date().getTime();

    if(this.started) {
        this.update();
        this.renderFrame();
    }

    if(!this.isStopped) {
        requestAnimationFrame(this.tick.bind(this));
    }
}

Game.prototype.start = function() {
    this.started = true;
    this.tick();
    console.log("Game loop started.");
}

Game.prototype.stop = function() {
    console.log("Game stopped.");
    this.isStopped = true;
}

Game.prototype.restart = function() {
    console.log("Beginning restart");

    this.entities = [];

    this.started = true;

    console.log("Finished restart");
}

Game.prototype.createCamera = function() {
    console.log('creating camera');
    this.camera = new Camera(300, 300, 0, 0, this.map.getHauteur() * 32, this.map.getLargeur() * 32);
    this.camera.setDeadZoneSize(100, 100);
    var windowSize = this.camera.getWindowSize();
    this.canvas.width = windowSize.width;
    this.canvas.height = windowSize.height;
}

Game.prototype.drawFPS = function() {
	var nowTime = new Date(),
	    diffTime = nowTime.getTime() - this.lastTime.getTime();

	if (diffTime >= 1000) {
	    this.realFPS = this.frameCount;
	    this.frameCount = 0;
	    this.lastTime = nowTime;
	}
	this.frameCount++;

	//this.drawText("FPS: " + this.realFPS + " / " + this.maxFPS, 30, 30, false);
	this.drawText("FPS: " + this.realFPS, 30, 30, false);
}

Game.prototype.drawText = function(text, x, y, centered, color, strokeColor) {
    var ctx = this.context;
    
    var strokeSize = 3;
    
    if(text && x && y) {
        ctx.save();
        if(centered) {
            ctx.textAlign = "center";
        }
        ctx.strokeStyle = strokeColor || "#373737";
        ctx.lineWidth = strokeSize;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = color || "white";
        ctx.fillText(text, x, y);
        ctx.restore();
    }
}

Game.prototype.drawDebugInfo = function() {
    if(this.isDebugInfoVisible) {
        this.drawFPS();
    }
}

Game.prototype.clearScreen = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Game.prototype.renderFrame = function() {
	this.clearScreen();
	this.map.dessinerMap(this.context, this.camera);
	this.entities.forEach(function(entity) { entity.draw(this.context, this.map, this.camera) }.bind(this));
	this.drawDebugInfo();
}

Game.prototype.update = function(){
  this.entities.forEach(function(entity) { entity.update(this.keyboard, this.map) }.bind(this));
  this.camera.updateCameraPosition();
};


window.__debug = false;
window.__debugDrawingColor1 = "#EEE";
window.__debugDrawingColor2 = "#F00";
var c = document.getElementById('canvas');
var keyboard = new Keyboard(window);
console.log(keyboard.isPressed('up'));
new Game({ canvas : c, keyboard : keyboard }).start();