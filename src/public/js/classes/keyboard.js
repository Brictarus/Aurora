var Keyboard = function(container) {
	this._keys  = {};

	this.keyMappings = {
		'up':    38,
		'down':  40,
		'left':  37,
		'right': 39,

		'a': 	 65
	};

	if (container) {
		container.addEventListener('keydown', this.onKeyDown.bind(this), false);
		container.addEventListener('keyup', this.onKeyUp.bind(this), false);
	}
}

Keyboard.prototype.onKeyDown = function(ev) {
	if (!this._keys[ev.keyCode]) {
		this._keys[ev.keyCode] = true;
	}
}

Keyboard.prototype.onKeyUp = function(ev) {
	delete this._keys[ev.keyCode];
}

Keyboard.prototype.isPressed = function(key) {
	if(typeof key === "string") {
		return this.isPressed(this.keyMappings[key]);
	}
	return !!this._keys[key];
}