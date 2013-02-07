function Camera(width, height, initialX, initialY, mapWidth, mapHeight) {
	this.xScroll = initialX;
	this.yScroll = initialY;
	this.scrollingWindowWidth = width;
	this.scrollingWindowHeight = height;
	this.mapWidth = mapWidth;
	this.mapHeight = mapHeight;
	
	this._deadZoneW = 0;
	this._deadZoneH = 0;
	
	this._trackedObject = null;
}

Camera.prototype._clampScroll = function() {
	if (this.xScroll < 0)
		this.xScroll = 0;
	if (this.yScroll < 0)
		this.yScroll = 0;
	if (this.xScroll > this.mapWidth - this.scrollingWindowWidth)
		this.xScroll = this.mapWidth - this.scrollingWindowWidth;
	if (this.yScroll > this.mapHeight - this.scrollingWindowHeight)
		this.yScroll = this.mapHeight - this.scrollingWindowHeight;
}

Camera.prototype.setDeadZoneSize = function(w, h) {
	this._deadZoneW = Math.min(w, this.scrollingWindowWidth);
	this._deadZoneH = Math.min(h, this.scrollingWindowHeight);
}

Camera.prototype.getWindowSize = function() {
	return  {
		height 	: this.scrollingWindowHeight,
		width	: this.scrollingWindowWidth
	};
}

Camera.prototype.followObject = function(data) {
	this._trackedObject = data;
}

Camera.prototype.updateCameraPosition = function() {
	if (this._trackedObject != null) {
		var xDeadZone = this.xScroll + Math.floor((this.scrollingWindowWidth - this._deadZoneW) / 2);
		var yDeadZone = this.yScroll + Math.floor((this.scrollingWindowHeight - this._deadZoneH) / 2);
		var deadZoneRect = {x: xDeadZone, y: yDeadZone, w: this._deadZoneW, h: this._deadZoneH};
		var trackedObjectRect = { x: this._trackedObject.xPixels, y: this._trackedObject.yPixels, w: this._trackedObject.w, h: this._trackedObject.h};
		var canTrack = collisions.canContain(deadZoneRect, trackedObjectRect);
		if (canTrack) {
			var pointIsInBox = collisions.contains(deadZoneRect, trackedObjectRect);
			if (__debug && pointIsInBox) console.log("contains ! ");
			if (!pointIsInBox) {
				if (this._trackedObject.xPixels < xDeadZone)
					this.xScroll = this._trackedObject.xPixels - (xDeadZone - this.xScroll);
				else if (this._trackedObject.xPixels + this._trackedObject.w > xDeadZone + this._deadZoneW)
					this.xScroll = this._trackedObject.xPixels + this._trackedObject.w - (this.scrollingWindowWidth - Math.floor((this.scrollingWindowWidth - this._deadZoneW) / 2));
				
				if (this._trackedObject.yPixels < yDeadZone)
					this.yScroll = this._trackedObject.yPixels - (yDeadZone - this.yScroll);
				else if (this._trackedObject.yPixels + this._trackedObject.h > yDeadZone + this._deadZoneH)
					this.yScroll = this._trackedObject.yPixels + this._trackedObject.h - (this.scrollingWindowHeight - Math.floor((this.scrollingWindowHeight - this._deadZoneH) / 2));
				
				this._clampScroll();
			}
		}
		else {
			this.xScroll = Math.floor(trackedObjectRect.x + trackedObjectRect.w / 2 - this.scrollingWindowWidth / 2);
			this.yScroll = Math.floor(trackedObjectRect.y + trackedObjectRect.h / 2 - this.scrollingWindowHeight / 2);
			this._clampScroll();
		}
	}
}

Camera.prototype.draw = function(ctxt) {
	var xStart = Math.floor((this.scrollingWindowWidth - this._deadZoneW) / 2); 
	var yStart = Math.floor((this.scrollingWindowHeight - this._deadZoneH) / 2);
	var xStop = xStart + this._deadZoneW;
	var yStop = yStart + this._deadZoneH;
	ctxt.strokeStyle = __debugDrawingColor2;
	ctxt.strokeRect(xStart, yStart, this._deadZoneW, this._deadZoneH);
}

Camera.prototype.moveScrollArea = function(direction, delta) {
	if(direction == DIRECTION.HAUT) {
		this.yScroll -= delta;
	} else if(direction == DIRECTION.BAS) {
		this.yScroll += delta;
	} else if(direction == DIRECTION.GAUCHE) {
		this.xScroll -= delta;
	} else if(direction == DIRECTION.DROITE) {
		this.xScroll += delta;
	}
	this._clampscroll();
}