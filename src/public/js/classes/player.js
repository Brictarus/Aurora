var Player = Entity.extend({
	
	hpMax : 100,
	hp : 80,
	mpMax : 80,
	mp : 60,

	isMoving : 0,
	moveAnimationDuration : 60,
	colors : ['purple', 'blue', 'green', 'yellow', 'orange', 'red'],

	initialize : function(name, gx, gy, tileWidth, tileHeight, w, h, direction) {
		var x = gx * tileWidth;
		var y = gy * tileHeight;
		w = tileWidth;
		h = tileHeight;
		this.__super__.initialize.call(this, name, x, y, w, h, 'red');
		this.gx = gx;
		this.gy = gy;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.direction = direction;
	},

	draw : function(ctxt, camera) {
		this.__super__.draw.call(this, ctxt, camera);
	},

	move : function(direction, map) {
		if (!this.isMoving) {
			this.direction = direction;
			var dest = map.getAdjacentCellCoord(
				{ x : this.gx, y : this.gy }, direction);
			// On effectue le déplacement
			if (dest != null) {
				this.isMoving = 1;
				this.gx = dest.x;
				this.gy = dest.y;
			}
		}
	}, 

	update : function(map, keyboard) {
		
		if (this.isMoving) {
			this.isMoving++;
			if (this.isMoving > this.moveAnimationDuration) {
				this.isMoving = 0;
			}
		}
		if (this.isMoving) {
			var step = Math.round(this.isMoving / (this.moveAnimationDuration / (this.colors.length - 1)));
			this.color = this.colors[step];
		}

		if (keyboard) {
			if (keyboard.isPressed('up')) {
	            this.move(direction.UP, map);
	        }
	        else if (keyboard.isPressed('down')) {
	            this.move(direction.DOWN, map);
	        }
	        else if (keyboard.isPressed('left')) {
	            this.move(direction.LEFT, map);
	        }
	        else if (keyboard.isPressed('right')) {
	            this.move(direction.RIGHT, map);
	        }
    	}

    	var offsetX = 0,
    		offsetY = 0;
    	if (this.isMoving) {
    		var prct = (this.isMoving / this.moveAnimationDuration);
    		// console.log('prct : ' + prct);
    		var multiplier = (this.direction == direction.UP || this.direction == direction.LEFT) ? 1 : -1;
    		if (this.direction == direction.UP || this.direction == direction.DOWN) {
    			offsetY = (this.tileHeight * multiplier) - (this.tileHeight * prct * multiplier);
    		} else {
    			offsetX = (this.tileWidth * multiplier) - (this.tileWidth * prct * multiplier);
    		}
    	}
    	this.x = this.gx * this.tileWidth + offsetX;
		this.y = this.gy * this.tileHeight + offsetY;
	}
});