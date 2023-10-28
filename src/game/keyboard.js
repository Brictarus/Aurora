export class Keyboard{
	constructor(container) {
		this._keys  = {};

		this.keyMappings = {
			'up':    38,
			'down':  40,
			'left':  37,
			'right': 39,

			'a': 	 65
		};

		this.reversedKeyMapping = {};
		for (let role in this.keyMappings) {
			this.reversedKeyMapping[this.keyMappings[role]] = role;
		}

		if (container) {
			container.addEventListener('keydown', this.onKeyDown.bind(this), false);
			container.addEventListener('keyup', this.onKeyUp.bind(this), false);
		}
	}

	onKeyDown(ev) {
		if (!this._keys[ev.keyCode]) {
			this._keys[ev.keyCode] = true;
		}
		return false;
	}

	onKeyUp(ev) {
		delete this._keys[ev.keyCode];
		return false;
	}

	isPressed(key) {
		if(typeof key === "string") {
			return this.isPressed(this.keyMappings[key]);
		}
		return !!this._keys[key];
	}
}